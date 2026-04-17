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
        
        # AI model orqali xavf va tavsiyalarni hisoblash
        risk_result = model.predict_risk(
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
        
        user_data = {
            "age": data.age,
            "gender": data.gender,
            "bmi": bmi,
            "bmi_category": bmi_category,
            "sleep_quality": data.sleep_quality,
            "mood": data.mood,
            "alcohol": data.alcohol,
            "joint_pain": data.joint_pain
        }
        
        # Tavsiyalarni chiroyli formatda tayyorlash
        recommendations_list = []
        for rec in risk_result["recommendations"]:
            if "❗" in rec or "⚠️" in rec or "✅" in rec or "😔" in rec or "😴" in rec or "🍺" in rec or "🦵" in rec or "⚖️" in rec:
                recommendations_list.append({
                    "priority": "yuqori" if "❗" in rec else "o'rta" if "⚠️" in rec else "past",
                    "text": rec,
                    "deadline": self._get_deadline(rec)
                })
            else:
                recommendations_list.append({
                    "priority": "o'rta",
                    "text": rec,
                    "deadline": "3 oy ichida"
                })
        
        return {
            "success": True,
            "data": {
                "user_info": user_data,
                "risk_assessment": {
                    "risk_level": risk_result["risk_level"],
                    "risk_score": risk_result["risk_score"],
                    "max_score": 100
                },
                "recommendations": recommendations_list
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

def _get_deadline(self, text):
    if "darhol" in text or "har kuni" in text:
        return "darhol"
    elif "1 hafta" in text:
        return "1 hafta ichida"
    elif "3 oy" in text:
        return "3 oy ichida"
    else:
        return "yiliga 1 marta"

@router.get("/health-check")
async def health_check():
    return {"status": "ok", "message": "AI Model ishlayapti"}