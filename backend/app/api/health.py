from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from backend.app.ml.risk_model import HealthRiskModel

router = APIRouter(prefix="/api", tags=["Health Assessment"])
model = HealthRiskModel()

class HealthData(BaseModel):
    age: int
    gender: str
    height_cm: float
    weight_kg: float
    blood_pressure: Optional[str] = None
    smoking: bool = False
    family_history: bool = False
    sleep_quality: int = 7
    mood: int = 7
    alcohol: int = 0
    joint_pain: int = 0

@router.post("/assess-risk")
async def assess_risk(data: HealthData):
    try:
        bmi = model.calculate_bmi(data.weight_kg, data.height_cm)
        bmi_category = model.get_bmi_category(bmi)

        result = model.predict_risk(
            age=data.age,
            bmi=bmi,
            blood_pressure=data.blood_pressure,
            smoking=data.smoking,
            family_history=data.family_history,
            sleep_quality=data.sleep_quality,
            mood=data.mood,
            alcohol=data.alcohol,
            joint_pain=data.joint_pain
        )

        # Tavsiyalarni formatlash
        recommendations_list = []
        for rec in result["recommendations"]:
            if "❗" in rec or "Kardiolog" in rec or "shifokorga" in rec:
                priority = "yuqori"
                deadline = "1 hafta ichida"
            elif "⚠️" in rec or "qon bosimini" in rec or "tekshiruv" in rec:
                priority = "o'rta"
                deadline = "1 oy ichida"
            elif "😴" in rec or "uyqu" in rec:
                priority = "o'rta"
                deadline = "2 hafta ichida"
            elif "😔" in rec or "psixolog" in rec or "stress" in rec:
                priority = "o'rta"
                deadline = "1 oy ichida"
            elif "⚖️" in rec or "vazn" in rec:
                priority = "yuqori"
                deadline = "darhol"
            else:
                priority = "past"
                deadline = "3 oy ichida"

            recommendations_list.append({
                "priority": priority,
                "text": rec,
                "deadline": deadline
            })

        return {
            "success": True,
            "data": {
                "user_info": {
                    "age": data.age,
                    "gender": data.gender,
                    "bmi": bmi,
                    "bmi_category": bmi_category
                },
                "risk_assessment": {
                    "risk_level": result["risk_level"],
                    "risk_score": result["risk_score"],
                    "max_score": 100
                },
                "recommendations": recommendations_list
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/health-check")
async def health_check():
    return {"status": "ok", "message": "AI Model ishlayapti"}