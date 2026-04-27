from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

# Absolute imports (REQUIRED for Render)
from backend import models, schemas, database
from backend.ml_engine import MarksPredictor

# Create DB tables
models.Base.metadata.create_all(bind=database.engine)

# App init
app = FastAPI(title="Student Marks Prediction API")

# CORS (keep open for now)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ML Model
predictor = MarksPredictor()


# -----------------------------
# Health Check
# -----------------------------
@app.get("/api/v1/health")
def health_check():
    return {"status": "System Online"}


# -----------------------------
# Prediction Endpoint
# -----------------------------
@app.post("/api/v1/predict", response_model=schemas.PredictionResponse)
def predict_marks(
    request: schemas.PredictionRequest,
    db: Session = Depends(database.get_db)
):
    try:
        # Check if student exists
        student = db.query(models.Student).filter(
            models.Student.roll_number == request.roll_number
        ).first()

        # Create or update student
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

        # Process each subject
        for subject in request.subjects:
            predicted_marks, risk_category = predictor.inference(
                previous_marks=subject.previous_marks,
                target_study_hours=subject.target_study_hours,
                current_cgpa=request.current_cgpa
            )

            # Save prediction record
            record = models.PredictionRecord(
                student_id=student.id,
                subject_name=subject.subject_name,
                previous_marks=subject.previous_marks,
                target_study_hours=subject.target_study_hours,
                predicted_marks=predicted_marks,
                risk_category=risk_category
            )
            db.add(record)

            # Append response
            results.append(
                schemas.PredictionResult(
                    subject_name=subject.subject_name,
                    predicted_marks=predicted_marks,
                    risk_category=risk_category
                )
            )

        db.commit()

        return schemas.PredictionResponse(
            student_id=student.id,
            results=results
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
