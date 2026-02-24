from sqlalchemy.orm import Session
from app.models.models import AuditLog


def log_action(db: Session, entity_type: str, entity_id: str, action: str, actor: str, old: str | None = None, new: str | None = None):
    db.add(AuditLog(entity_type=entity_type, entity_id=entity_id, action=action, actor=actor, old_value=old, new_value=new))
