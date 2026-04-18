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

        # ========== 1. YURAK-QON TOMIR XAVFI ==========
        heart_risk = 0
        if age > 50:
            heart_risk += 25
            recommendations.append("❗ 50 yoshdan oshganingizda yurak xavfi ortadi. Kardiologga murojaat qiling.")
        if bmi > 30:
            heart_risk += 25
            recommendations.append("❗ Ortiqcha vazn yurakka yuk beradi. Vaznni kamaytirish tavsiya etiladi.")
        if smoking:
            heart_risk += 20
            recommendations.append("❗ Chekish yurak-qon tomir kasalliklari xavfini oshiradi. Chekishni tashlash tavsiya etiladi.")
        if family_history:
            heart_risk += 15
            recommendations.append("❗ Oilada yurak kasalliklari bo'lganlar muntazam tekshiruvdan o'tishi kerak.")
        if blood_pressure:
            try:
                systolic = int(blood_pressure.split('/')[0])
                if systolic > 140:
                    heart_risk += 20
                    recommendations.append("⚠️ Qon bosimingiz yuqori (140/90 dan yuqori). Har kuni o'lchab boring va shifokorga murojaat qiling.")
                elif systolic > 130:
                    heart_risk += 10
                    recommendations.append("⚠️ Qon bosimingiz me'yordan biroz yuqori. Tuzni kamaytiring va muntazam tekshirib turing.")
            except:
                pass
        if sleep_quality < 6:
            heart_risk += 10
            recommendations.append("😴 Yomon uyqu yurak xavfini oshiradi. Kuniga 7-8 soat uxlashga harakat qiling.")
        
        if heart_risk > 50:
            risk_score += heart_risk

        # ========== 2. QANDLI DIABET XAVFI ==========
        diabetes_risk = 0
        if age > 45:
            diabetes_risk += 20
            recommendations.append("❗ 45 yoshdan oshganingizda qandli diabet xavfi ortadi. Qon glyukozasini tekshiring.")
        if bmi > 30:
            diabetes_risk += 30
            recommendations.append("❗ Ortiqcha vazn diabet xavfini oshiradi. Parhez va jismoniy faollik tavsiya etiladi.")
        if family_history:
            diabetes_risk += 20
            recommendations.append("❗ Oilada diabet bo'lganlar muntazam tekshiruvdan o'tishi kerak.")
        if smoking:
            diabetes_risk += 10
        if sleep_quality < 6:
            diabetes_risk += 10
        
        if diabetes_risk > 50:
            recommendations.append("⚠️ Qandli diabet xavfi yuqori. Glyukozalanmagan gemoglobin (HbA1c) tekshiruvidan o'ting.")
            risk_score += diabetes_risk

        # ========== 3. DEPRESSIYA XAVFI ==========
        depression_risk = 0
        if mood < 5:
            depression_risk += 30
            recommendations.append("😔 Kayfiyatingiz past. Psixolog bilan suhbatlashish foydali bo'lishi mumkin.")
        if sleep_quality < 5:
            depression_risk += 30
            recommendations.append("😴 Uyqu sifatingiz yomon. Bu kayfiyatga ta'sir qilishi mumkin.")
        if age > 60:
            depression_risk += 15
        
        if depression_risk > 50:
            recommendations.append("🧘‍♀️ Stressni boshqarish usullarini o'rganing. Yoga yoki meditatsiya qilib ko'ring.")
            risk_score += depression_risk

        # ========== 4. JIGAR KASALLIGI ==========
        if alcohol >= 2:
            liver_risk = 35
            risk_score += liver_risk
            recommendations.append("🍺 Spirtli ichimliklarni ko'p iste'mol qilish jigar kasalliklariga olib kelishi mumkin. Kamaytirish tavsiya etiladi.")
        elif alcohol >= 1:
            recommendations.append("🍷 Spirtli ichimliklarni me'yorida iste'mol qiling. Haftada 1-2 martadan oshirmang.")

        # ========== 5. ARTRIT (BO'G'IM) ==========
        if joint_pain >= 1:
            arthritis_risk = 20 + (joint_pain * 10)
            risk_score += arthritis_risk
            recommendations.append("🦵 Bo'g'im og'rig'ingiz bor. Revmatologga murojaat qiling va yengil mashqlar qiling.")
            if bmi > 30:
                recommendations.append("⚖️ Ortiqcha vazn bo'g'imlarga yuk beradi. Vazn kamaytirish tavsiya etiladi.")

        # ========== 6. UMUMIY TAVSIYALAR ==========
        if bmi > 30:
            recommendations.append("⚖️ Vazn kamaytirish bo'yicha parhez va jismoniy mashqlar (haftada 150 daqiqa) tavsiya etiladi.")
        elif bmi > 25:
            recommendations.append("⚖️ Vazningiz me'yordan biroz yuqori. Parhez va mashqlar bilan vaznni kamaytirish foydali.")
        
        if sleep_quality < 6:
            recommendations.append("😴 Uyqu tartibingizni yaxshilang. Kuniga 7-8 soat uxlash tavsiya etiladi.")
        
        if mood < 5:
            recommendations.append("🧘‍♀️ Stressni boshqarish usullarini o'rganing. Yoga yoki meditatsiya qilib ko'ring.")
        
        if not smoking and alcohol == 0 and bmi < 30 and sleep_quality >= 6 and mood >= 6:
            recommendations.append("✅ Sog'lig'ingiz yaxshi. Yillik profilaktik tekshiruvlarni davom ettiring.")
        
        # Takrorlanuvchi tavsiyalarni olib tashlash
        unique_recommendations = []
        for rec in recommendations:
            if rec not in unique_recommendations:
                unique_recommendations.append(rec)

        # Xavf darajasini aniqlash
        if risk_score >= 70:
            overall_risk = "YUQORI"
        elif risk_score >= 40:
            overall_risk = "O'RTA"
        else:
            overall_risk = "PAST"

        return {
            "risk_level": overall_risk,
            "risk_score": min(risk_score, 100),
            "recommendations": unique_recommendations[:12]  # 12 tagacha tavsiya
        }