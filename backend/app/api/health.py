from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api", tags=["Health Assessment"])

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
        # Oddiy test javobi
        return {
            "success": True,
            "data": {
                "user_info": {
                    "age": data.age,
                    "gender": data.gender,
                    "bmi": 25.0,
                    "bmi_category": "Normal vazn"
                },
                "risk_assessment": {
                    "risk_level": "PAST",
                    "risk_score": 20,
                    "max_score": 100
                },
                "recommendations": [
                    {"priority": "past", "text": "Test ishlayapti", "deadline": "yiliga 1 marta"}
                ]
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/health-check")
async def health_check():
    return {"status": "ok", "message": "API ishlayapti"}