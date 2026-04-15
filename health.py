from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.ml.risk_model import HealthRiskModel

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

@router.post("/assess-risk")
async def assess_risk(data: HealthData):
    try:
        bmi = model.calculate_bmi(data.weight_kg, data.height_cm)
        bmi_category = model.get_bmi_category(bmi)
        risk_result = model.predict_risk(
            age=data.age,
            bmi=bmi,
            blood_pressure=data.blood_pressure,
            smoking=data.smoking,
            family_history=data.family_history
        )
        user_data = {
            "age": data.age,
            "gender": data.gender,
            "bmi": bmi,
            "bmi_category": bmi_category
        }
        recommendations = model.get_recommendations(
            risk_result["risk_level"],
            user_data
        )
        return {
            "success": True,
            "data": {
                "user_info": user_data,
                "risk_assessment": risk_result,
                "recommendations": recommendations
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/health-check")
async def health_check():
    return {"status": "ok", "message": "AI Model ishlayapti"}