class MarksPredictor:
    def inference(self, previous_marks: float, target_study_hours: float, current_cgpa: float) -> tuple[float, str]:
        predicted = (previous_marks * 0.55) + (target_study_hours * 2.5) + (current_cgpa * 2.0)
        score = min(max(predicted, 0.0), 100.0)
        
        if score <= 40:
            category = "Critical"
        elif 40 < score < 60:
            category = "Needs Improvement"
        elif 60 <= score < 80:
            category = "Good but can do better"
        else:
            category = "No problem zone"
            
        return score, category
