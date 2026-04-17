class HealthRiskModel:
    def __init__(self):
        print("Kengaytirilgan AI Model ishga tushdi!")

    def calculate_bmi(self, weight_kg, height_cm):
        height_m = height_cm / 100
        bmi = weight_kg / (height_m ** 2)
        return round(bmi, 1)

    def get_bmi_category(self, bmi):
        if bmi < 18.5:
            return "Kam vazn"
        elif bmi < 25:
            return "Normal vazn"
        elif bmi < 30:
            return "Ortiqcha vazn"
        elif bmi < 35:
            return "1-darajali semizlik"
        elif bmi < 40:
            return "2-darajali semizlik"
        else:
            return "3-darajali semizlik"

    def predict_risk(self, age, bmi, blood_pressure=None, smoking=False, 
                     family_history=False, sleep_quality=7, mood=7, 
                     alcohol=0, joint_pain=0):
        
        recommendations = []
        risk_score = 0

        # ========== YURAK XAVFI ==========
        heart_risk = 0
        if age > 50:
            heart_risk += 25
        if bmi > 30:
            heart_risk += 25
        if smoking:
            heart_risk += 20
        if family_history:
            heart_risk += 15
        if blood_pressure:
            try:
                systolic = int(blood_pressure.split('/')[0])
                if systolic > 140:
                    heart_risk += 20
            except:
                pass
        if sleep_quality < 5:
            heart_risk += 10
        
        if heart_risk > 50:
            recommendations.append("❗ Yurak xavfi yuqori. Kardiologga murojaat qiling.")
            risk_score += heart_risk

        # ========== QANDLI DIABET ==========
        diabetes_risk = 0
        if age > 45:
            diabetes_risk += 20
        if bmi > 30:
            diabetes_risk += 30
        if family_history:
            diabetes_risk += 20
        if smoking:
            diabetes_risk += 10
        
        if diabetes_risk > 50:
            recommendations.append("❗ Qandli diabet tekshiruvidan o'ting (glyukozalanmagan gemoglobin).")
            risk_score += diabetes_risk

        # ========== GIPERTONIYA ==========
        hypertension_risk = 0
        if age > 40:
            hypertension_risk += 15
        if bmi > 27:
            hypertension_risk += 25
        if smoking:
            hypertension_risk += 15
        if family_history:
            hypertension_risk += 15
        if blood_pressure:
            try:
                systolic = int(blood_pressure.split('/')[0])
                if systolic > 130:
                    hypertension_risk += 25
            except:
                pass
        
        if hypertension_risk > 50:
            recommendations.append("⚠️ Qon bosimini har kuni ertalab va kechqurun o'lchab turing.")
            risk_score += hypertension_risk

        # ========== DEPRESSIYA ==========
        depression_risk = 0
        if mood < 4:
            depression_risk += 40
        if sleep_quality < 4:
            depression_risk += 30
        if age > 60:
            depression_risk += 15
        
        if depression_risk > 50:
            recommendations.append("😔 Psixolog yoki psixiatrga murojaat qiling. Stressni boshqarish va meditatsiya tavsiya etiladi.")
            risk_score += depression_risk

        # ========== JIGAR KASALLIGI ==========
        liver_risk = 0
        if alcohol >= 2:
            liver_risk += 35
        if bmi > 30:
            liver_risk += 30
        
        if liver_risk > 50:
            recommendations.append("🍺 Jigar fermentlarini tekshiring (ALT, AST). Spirtli ichimliklarni kamaytiring.")
            risk_score += liver_risk

        # ========== ARTRIT ==========
        arthritis_risk = 0
        if age > 50:
            arthritis_risk += 25
        if bmi > 30:
            arthritis_risk += 30
        if joint_pain > 0:
            arthritis_risk += 25
        
        if arthritis_risk > 50:
            recommendations.append("🦵 Revmatologga murojaat qiling. Yengil mashqlar va vazn kamaytirish tavsiya etiladi.")
            risk_score += arthritis_risk

        # ========== UMUMIY TAVSIYALAR ==========
        if risk_score < 50:
            recommendations.append("✅ Sog'lig'ingiz yaxshi. Yillik profilaktik tekshiruvlarni davom ettiring.")
        
        if bmi > 30:
            recommendations.append("⚖️ Vazn kamaytirish bo'yicha parhez va jismoniy mashqlar (haftada 150 daqiqa).")
        
        if sleep_quality < 6:
            recommendations.append("😴 Uyqu tartibingizni yaxshilang. Kuniga 7-8 soat uxlash tavsiya etiladi.")
        
        if mood < 5:
            recommendations.append("🧘‍♀️ Stressni boshqarish usullarini o'rganing. Yoga yoki meditatsiya qilib ko'ring.")

        # Xavf darajasini aniqlash
        if risk_score >= 70:
            overall_risk = "YUQORI"
        elif risk_score >= 40:
            overall_risk = "O'RTA"
        else:
            overall_risk = "PAST"

        # Takrorlanuvchi tavsiyalarni olib tashlash
        unique_recommendations = []
        for rec in recommendations:
            if rec not in unique_recommendations:
                unique_recommendations.append(rec)

        return {
            "risk_level": overall_risk,
            "risk_score": min(risk_score, 100),
            "recommendations": unique_recommendations[:8]
        }