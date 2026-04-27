from fastapi import FastAPI
import Depends 
import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import models, schemas, database
from .ml_engine import MarksPredictor

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Student Marks Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

predictor = MarksPredictor()

@app.get("/api/v1/health")
def health_check():
    return {"status": "System Online"}

@app.post("/api/v1/predict", response_model=schemas.PredictionResponse)
def predict_marks(request: schemas.PredictionRequest, db: Session = Depends(database.get_db)):
    student = db.query(models.Student).filter(models.Student.roll_number == request.roll_number).first()
    if not student:
        student = models.Student(
            name=request.student_name,
            roll_number=request.roll_number,
            branch=request.branch,
            year=request.year,
            current_cgpa=request.current_cgpa
        )
        db.add(student)
        db.commit()
        db.refresh(student)
    else:
        student.name = request.student_name
        student.branch = request.branch
        student.year = request.year
        student.current_cgpa = request.current_cgpa
        db.commit()
        db.refresh(student)

    results = []
    
    for subject in request.subjects:
        predicted_marks, risk_category = predictor.inference(
            previous_marks=subject.previous_marks,
            target_study_hours=subject.target_study_hours,
            current_cgpa=request.current_cgpa
        )
        
        record = models.PredictionRecord(
            student_id=student.id,
            subject_name=subject.subject_name,
            previous_marks=subject.previous_marks,
            target_study_hours=subject.target_study_hours,
            predicted_marks=predicted_marks,
            risk_category=risk_category
        )
        db.add(record)
        
        results.append(schemas.PredictionResult(
            subject_name=subject.subject_name,
            predicted_marks=predicted_marks,
            risk_category=risk_category
        ))

    db.commit()

    return schemas.PredictionResponse(
        student_id=student.id,
        results=results
    )
