import enum
from datetime import datetime, date
from sqlalchemy import String, Integer, DateTime, ForeignKey, Float, Boolean, Text, Date, Enum, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.session import Base


class Role(str, enum.Enum):
    ADMIN = "admin"
    ANALYST = "analyst"
    HEAD_UNIT = "head_unit"
    QC_MANAGER = "qc_manager"
    HEAD_LAB = "head_lab"


class SampleStatus(str, enum.Enum):
    RECEIVED = "received"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    QA_REVIEW = "qa_review"
    RELEASED = "released"
    REJECTED = "rejected"


class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    username: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[Role] = mapped_column(Enum(Role))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)


class Client(Base):
    __tablename__ = "clients"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(255), unique=True)
    email: Mapped[str | None] = mapped_column(String(255), nullable=True)


class Submission(Base):
    __tablename__ = "submissions"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    client_id: Mapped[int] = mapped_column(ForeignKey("clients.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    discount: Mapped[float] = mapped_column(Float, default=0)
    tax: Mapped[float] = mapped_column(Float, default=0)
    rush_fee: Mapped[float] = mapped_column(Float, default=0)
    client = relationship("Client")


class Sample(Base):
    __tablename__ = "samples"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    submission_id: Mapped[int] = mapped_column(ForeignKey("submissions.id"))
    lab_id: Mapped[str] = mapped_column(String(40), unique=True, index=True)
    external_sample_id: Mapped[str | None] = mapped_column(String(120), nullable=True)
    species: Mapped[str] = mapped_column(String(80))
    sample_type: Mapped[str] = mapped_column(String(80))
    collection_date: Mapped[date] = mapped_column(Date)
    received_at: Mapped[datetime] = mapped_column(DateTime)
    condition_upon_receipt: Mapped[str] = mapped_column(String(120))
    temperature: Mapped[str | None] = mapped_column(String(40), nullable=True)
    sampling_person: Mapped[str | None] = mapped_column(String(120), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[SampleStatus] = mapped_column(Enum(SampleStatus), default=SampleStatus.RECEIVED)
    is_positive: Mapped[bool] = mapped_column(Boolean, default=False)


class TestCatalog(Base):
    __tablename__ = "test_catalog"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    test_name: Mapped[str] = mapped_column(String(120), unique=True)
    analyte: Mapped[str] = mapped_column(String(120))
    iso_method: Mapped[str] = mapped_column(String(120))
    sla_hours: Mapped[int] = mapped_column(Integer)
    price: Mapped[float] = mapped_column(Float)
    units: Mapped[str] = mapped_column(String(50))
    positive_rule: Mapped[str | None] = mapped_column(Text, nullable=True)


class SampleTest(Base):
    __tablename__ = "sample_tests"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    sample_id: Mapped[int] = mapped_column(ForeignKey("samples.id"))
    test_id: Mapped[int] = mapped_column(ForeignKey("test_catalog.id"))
    analyst_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    due_at: Mapped[datetime] = mapped_column(DateTime)
    result_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    result_value: Mapped[float | None] = mapped_column(Float, nullable=True)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    __table_args__ = (UniqueConstraint("sample_id", "test_id", name="uq_sample_test"),)


class ReportVersion(Base):
    __tablename__ = "report_versions"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    sample_id: Mapped[int] = mapped_column(ForeignKey("samples.id"))
    version: Mapped[int] = mapped_column(Integer, default=1)
    reason: Mapped[str] = mapped_column(Text, default="initial")
    report_id: Mapped[str] = mapped_column(String(80), unique=True)
    issued_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    released: Mapped[bool] = mapped_column(Boolean, default=False)


class Template(Base):
    __tablename__ = "templates"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    template_type: Mapped[str] = mapped_column(String(20))
    name: Mapped[str] = mapped_column(String(80))
    content: Mapped[str] = mapped_column(Text)


class AuditLog(Base):
    __tablename__ = "audit_logs"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    entity_type: Mapped[str] = mapped_column(String(80))
    entity_id: Mapped[str] = mapped_column(String(80))
    action: Mapped[str] = mapped_column(String(120))
    old_value: Mapped[str | None] = mapped_column(Text, nullable=True)
    new_value: Mapped[str | None] = mapped_column(Text, nullable=True)
    actor: Mapped[str] = mapped_column(String(80))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
