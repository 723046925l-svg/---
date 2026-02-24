from datetime import datetime, timedelta
from io import BytesIO
import csv
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
import qrcode
from reportlab.pdfgen import canvas
from app.db.session import Base, engine, get_db
from app.models.models import User, Client, Submission, Sample, TestCatalog, SampleTest, Role, SampleStatus, ReportVersion, Template
from app.schemas.schemas import LoginIn, TokenOut, ClientIn, SubmissionIn, SampleIn, StatusIn, AssignTestIn, ResultIn, TemplateIn
from app.core.security import verify_password, create_token, get_password_hash
from app.core.config import settings
from app.api.deps import require_roles, get_current_user
from app.services.audit import log_action

app = FastAPI(title=settings.app_name)

WORKFLOW = {
    SampleStatus.RECEIVED: SampleStatus.IN_PROGRESS,
    SampleStatus.IN_PROGRESS: SampleStatus.COMPLETED,
    SampleStatus.COMPLETED: SampleStatus.QA_REVIEW,
    SampleStatus.QA_REVIEW: SampleStatus.RELEASED,
}


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)


@app.post("/api/auth/login", response_model=TokenOut)
def login(payload: LoginIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == payload.username).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return TokenOut(
        access_token=create_token(user.username, user.role.value, settings.access_token_expire_minutes),
        refresh_token=create_token(user.username, user.role.value, settings.refresh_token_expire_minutes),
    )


@app.post("/api/clients")
def create_client(payload: ClientIn, db: Session = Depends(get_db), user=Depends(require_roles(Role.ANALYST))):
    client = Client(**payload.model_dump())
    db.add(client)
    db.commit()
    db.refresh(client)
    log_action(db, "client", str(client.id), "create", user.username)
    db.commit()
    return client


@app.post("/api/submissions")
def create_submission(payload: SubmissionIn, db: Session = Depends(get_db), user=Depends(require_roles(Role.ANALYST))):
    sub = Submission(**payload.model_dump())
    db.add(sub)
    db.commit()
    db.refresh(sub)
    log_action(db, "submission", str(sub.id), "create", user.username)
    db.commit()
    return sub


@app.post("/api/samples")
def create_sample(payload: SampleIn, db: Session = Depends(get_db), user=Depends(require_roles(Role.ANALYST))):
    count = db.query(Sample).count() + 1
    lab_id = f"LAB-{datetime.utcnow().year}-{count:06d}"
    sample = Sample(**payload.model_dump(), lab_id=lab_id)
    db.add(sample)
    db.commit()
    db.refresh(sample)
    log_action(db, "sample", str(sample.id), "create", user.username, new=sample.status.value)
    db.commit()
    return sample


@app.patch("/api/samples/{sample_id}/status")
def update_status(sample_id: int, payload: StatusIn, db: Session = Depends(get_db), user=Depends(get_current_user)):
    sample = db.query(Sample).filter(Sample.id == sample_id).first()
    if not sample:
        raise HTTPException(404, "Sample not found")
    if sample.status == SampleStatus.RELEASED:
        raise HTTPException(400, "Released samples are immutable")
    if payload.status == SampleStatus.REJECTED:
        sample.status = SampleStatus.REJECTED
    else:
        expected = WORKFLOW.get(sample.status)
        if payload.status != expected:
            raise HTTPException(400, f"Invalid transition from {sample.status} to {payload.status}")
        sample.status = payload.status
    log_action(db, "sample", str(sample_id), "status_change", user.username, old=str(sample.status), new=payload.status.value)
    db.commit()
    return {"status": sample.status}


@app.post("/api/samples/{sample_id}/tests")
def assign_test(sample_id: int, payload: AssignTestIn, db: Session = Depends(get_db), user=Depends(require_roles(Role.ANALYST))):
    sample = db.query(Sample).filter(Sample.id == sample_id).first()
    test = db.query(TestCatalog).filter(TestCatalog.id == payload.test_id).first()
    if not sample or not test:
        raise HTTPException(404, "Sample/test missing")
    st = SampleTest(sample_id=sample_id, test_id=payload.test_id, analyst_id=payload.analyst_id, due_at=sample.received_at + timedelta(hours=test.sla_hours))
    db.add(st)
    sample.status = SampleStatus.IN_PROGRESS
    log_action(db, "sample_test", f"{sample_id}:{payload.test_id}", "assign", user.username)
    db.commit()
    return {"ok": True}


@app.patch("/api/sample-tests/{sample_test_id}/result")
def enter_result(sample_test_id: int, payload: ResultIn, db: Session = Depends(get_db), user=Depends(require_roles(Role.HEAD_UNIT))):
    st = db.query(SampleTest).filter(SampleTest.id == sample_test_id).first()
    if not st:
        raise HTTPException(404, "Not found")
    sample = db.query(Sample).filter(Sample.id == st.sample_id).first()
    if sample.status == SampleStatus.RELEASED:
        raise HTTPException(400, "Released report requires revision")
    st.result_text = payload.result_text
    st.result_value = payload.result_value
    st.completed_at = datetime.utcnow()
    if payload.result_text and "positive" in payload.result_text.lower():
        sample.is_positive = True
    if all(x.completed_at for x in db.query(SampleTest).filter(SampleTest.sample_id == sample.id).all()):
        sample.status = SampleStatus.COMPLETED
    log_action(db, "result", str(st.id), "enter_result", user.username)
    db.commit()
    return {"ok": True}


@app.post("/api/samples/{sample_id}/release")
def release(sample_id: int, db: Session = Depends(get_db), user=Depends(require_roles(Role.HEAD_UNIT))):
    sample = db.query(Sample).filter(Sample.id == sample_id).first()
    if sample.status != SampleStatus.QA_REVIEW:
        raise HTTPException(400, "Sample must be in QA review")
    last = db.query(ReportVersion).filter(ReportVersion.sample_id == sample_id).order_by(ReportVersion.version.desc()).first()
    version = 1 if not last else last.version + 1
    report = ReportVersion(sample_id=sample_id, version=version, reason="release", report_id=f"COA-{datetime.utcnow().year}-{sample_id:05d}-v{version}", released=True)
    sample.status = SampleStatus.RELEASED
    db.add(report)
    log_action(db, "report", str(sample_id), "release", user.username)
    db.commit()
    return report


@app.post("/api/samples/{sample_id}/revise")
def revise(sample_id: int, reason: str, db: Session = Depends(get_db), user=Depends(require_roles(Role.QC_MANAGER))):
    sample = db.query(Sample).filter(Sample.id == sample_id).first()
    last = db.query(ReportVersion).filter(ReportVersion.sample_id == sample_id).order_by(ReportVersion.version.desc()).first()
    if not last:
        raise HTTPException(404, "No report exists")
    rv = ReportVersion(sample_id=sample_id, version=last.version + 1, reason=reason, report_id=f"COA-{datetime.utcnow().year}-{sample_id:05d}-v{last.version + 1}", released=False)
    sample.status = SampleStatus.QA_REVIEW
    db.add(rv)
    log_action(db, "report", str(sample_id), "revise", user.username, old=f"v{last.version}", new=f"v{rv.version}")
    db.commit()
    return rv


@app.get("/api/samples/{sample_id}/qr")
def sample_qr(sample_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    sample = db.query(Sample).filter(Sample.id == sample_id).first()
    if not sample:
        raise HTTPException(404, "Not found")
    img = qrcode.make(sample.lab_id)
    buf = BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return StreamingResponse(buf, media_type="image/png")


@app.post("/api/templates")
def upsert_template(payload: TemplateIn, db: Session = Depends(get_db), user=Depends(require_roles(Role.QC_MANAGER))):
    tpl = db.query(Template).filter(Template.template_type == payload.template_type, Template.name == payload.name).first()
    if not tpl:
        tpl = Template(**payload.model_dump())
        db.add(tpl)
    else:
        tpl.content = payload.content
    log_action(db, "template", payload.name, "upsert", user.username)
    db.commit()
    return tpl


@app.get("/api/samples/{sample_id}/coa")
def coa(sample_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    sample = db.query(Sample).filter(Sample.id == sample_id).first()
    if not sample:
        raise HTTPException(404, "Not found")
    report = db.query(ReportVersion).filter(ReportVersion.sample_id == sample_id).order_by(ReportVersion.version.desc()).first()
    tests = db.query(SampleTest, TestCatalog).join(TestCatalog, SampleTest.test_id == TestCatalog.id).filter(SampleTest.sample_id == sample_id).all()
    buf = BytesIO()
    p = canvas.Canvas(buf)
    p.drawString(50, 800, "Poultry LIMS - Certificate of Analysis")
    p.drawString(50, 785, f"Report: {report.report_id if report else 'draft'}")
    p.drawString(50, 770, f"Lab ID: {sample.lab_id}")
    p.drawString(50, 755, f"Sample Type: {sample.sample_type} | Received: {sample.received_at.date()}")
    y = 730
    for st, test in tests:
        p.drawString(50, y, f"{test.test_name}: {st.result_text or st.result_value or 'pending'}")
        y -= 15
    p.showPage()
    p.save()
    buf.seek(0)
    return StreamingResponse(buf, media_type="application/pdf")


@app.post("/api/import/submissions")
def bulk_import(file: UploadFile = File(...), db: Session = Depends(get_db), user=Depends(require_roles(Role.ANALYST))):
    content = file.file.read().decode("utf-8").splitlines()
    rows = list(csv.DictReader(content))
    errors = []
    for i, row in enumerate(rows, start=2):
        if not row.get("client_name") or not row.get("species"):
            errors.append({"row": i, "error": "client_name and species required"})
    if errors:
        return {"preview": rows[:20], "errors": errors}
    return {"preview": rows[:20], "message": "validated"}


@app.get("/api/dashboard")
def dashboard(db: Session = Depends(get_db), user=Depends(get_current_user)):
    total = db.query(Sample).count()
    positive = db.query(Sample).filter(Sample.is_positive.is_(True)).count()
    pending = db.query(Sample).filter(Sample.status != SampleStatus.RELEASED).count()
    released = db.query(Sample).filter(Sample.status == SampleStatus.RELEASED).count()
    overdue = db.query(SampleTest).filter(SampleTest.due_at < datetime.utcnow(), SampleTest.completed_at.is_(None)).count()
    revenue = 0.0
    for sub in db.query(Submission).all():
        subtotal = sum(x[0] for x in db.query(TestCatalog.price).join(SampleTest, SampleTest.test_id == TestCatalog.id).join(Sample, Sample.id == SampleTest.sample_id).filter(Sample.submission_id == sub.id).all())
        revenue += subtotal - sub.discount + sub.tax + sub.rush_fee
    return {"total_samples": total, "positive_samples": positive, "pending": pending, "released": released, "overdue_tests": overdue, "revenue": revenue}


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/seed")
def seed(db: Session = Depends(get_db)):
    if db.query(User).count() == 0:
        db.add_all([
            User(username="admin", password_hash=get_password_hash("admin123"), role=Role.ADMIN),
            User(username="analyst", password_hash=get_password_hash("analyst123"), role=Role.ANALYST),
            User(username="headunit", password_hash=get_password_hash("head123"), role=Role.HEAD_UNIT),
            User(username="qcmanager", password_hash=get_password_hash("qc123"), role=Role.QC_MANAGER),
            User(username="headlab", password_hash=get_password_hash("lab123"), role=Role.HEAD_LAB),
        ])
    if db.query(TestCatalog).count() == 0:
        db.add_all([
            TestCatalog(test_name="Salmonella Detection", analyte="Salmonella spp.", iso_method="ISO 6579", sla_hours=48, price=25, units="presence/absence", positive_rule="positive if detected"),
            TestCatalog(test_name="E. coli Count", analyte="E. coli", iso_method="ISO 16649", sla_hours=24, price=18, units="CFU/g", positive_rule=">100 CFU/g"),
            TestCatalog(test_name="Campylobacter", analyte="Campylobacter", iso_method="ISO 10272", sla_hours=48, price=30, units="presence/absence", positive_rule="positive if detected"),
        ])
    db.commit()
    return {"seeded": True}
