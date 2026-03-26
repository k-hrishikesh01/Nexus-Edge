from pydantic import BaseModel, Field
from typing import List

class SubjectInput(BaseModel):
    subject_name: str
    previous_marks: float = Field(..., ge=0, le=100)
    target_study_hours: float = Field(..., ge=0, le=40)

class PredictionRequest(BaseModel):
    student_name: str
    roll_number: str
    branch: str
    year: int
    current_cgpa: float
    subjects: List[SubjectInput]

class PredictionResult(BaseModel):
    subject_name: str
    predicted_marks: float
    risk_category: str

class PredictionResponse(BaseModel):
    student_id: str
    results: List[PredictionResult]
