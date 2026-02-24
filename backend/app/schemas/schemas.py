from datetime import datetime, date
from pydantic import BaseModel
from app.models.models import SampleStatus


class TokenOut(BaseModel):
    access_token: str
    refresh_token: str


class LoginIn(BaseModel):
    username: str
    password: str


class ClientIn(BaseModel):
    name: str
    email: str | None = None


class SubmissionIn(BaseModel):
    client_id: int
    discount: float = 0
    tax: float = 0
    rush_fee: float = 0


class SampleIn(BaseModel):
    submission_id: int
    external_sample_id: str | None = None
    species: str
    sample_type: str
    collection_date: date
    received_at: datetime
    condition_upon_receipt: str
    temperature: str | None = None
    sampling_person: str | None = None
    notes: str | None = None


class StatusIn(BaseModel):
    status: SampleStatus


class AssignTestIn(BaseModel):
    test_id: int
    analyst_id: int | None = None


class ResultIn(BaseModel):
    result_text: str | None = None
    result_value: float | None = None


class TemplateIn(BaseModel):
    template_type: str
    name: str
    content: str
