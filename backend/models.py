import uuid
from sqlalchemy import Column, String, Integer, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime

def generate_uuid():
    return str(uuid.uuid4())

class Student(Base):
    __tablename__ = "students"

    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    name = Column(String, index=True)
    roll_number = Column(String, unique=True, index=True)
    branch = Column(String)
    year = Column(Integer)
    current_cgpa = Column(Float)

    predictions = relationship("PredictionRecord", back_populates="student")

class PredictionRecord(Base):
    __tablename__ = "prediction_records"

    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    student_id = Column(String, ForeignKey("students.id"))
    subject_name = Column(String)
    previous_marks = Column(Float)
    target_study_hours = Column(Float)
    predicted_marks = Column(Float)
    risk_category = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

    student = relationship("Student", back_populates="predictions")
