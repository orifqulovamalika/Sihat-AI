class HealthRiskModel:
    def __init__(self):
        print("AI Model ishga tushdi!")

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

    def predict_risk(self, age, bmi, blood_pressure=None, smoking=False, family_history=False):
        risk_score = 0

        if age > 60:
            risk_score += 30
        elif age > 50:
            risk_score += 25
        elif age > 40:
            risk_score += 20
        elif age > 30:
            risk_score += 10
        elif age > 25:
            risk_score += 5

        if bmi > 35:
            risk_score += 30
        elif bmi > 30:
            risk_score += 25
        elif bmi > 27:
            risk_score += 15
        elif bmi > 25:
            risk_score += 10

        if blood_pressure:
            try:
                systolic = int(blood_pressure.split('/')[0])
                if systolic > 180:
                    risk_score += 30
                elif systolic > 160:
                    risk_score += 25
                elif systolic > 140:
                    risk_score += 20
                elif systolic > 130:
                    risk_score += 10
            except:
                pass

        if smoking:
            risk_score += 20

        if family_history:
            risk_score += 15

        if risk_score >= 70:
            level = "YUQORI"
            color = "🔴"
        elif risk_score >= 40:
            level = "O'RTA"
            color = "🟡"
        else:
            level = "PAST"
            color = "🟢"

        return {
            "risk_level": level,
            "risk_score": risk_score,
            "color": color,
            "max_score": 100
        }

    def get_recommendations(self, risk_level, user_data):
        recommendations = []

        if risk_level == "YUQORI":
            recommendations.append({
                "priority": "yuqori",
                "text": "❗ Kardiolog va endokrinologga murojaat qiling",
                "deadline": "1 hafta ichida"
            })
            recommendations.append({
                "priority": "yuqori",
                "text": "❗ Qon bosimini har kuni o'lchab turing",
                "deadline": "darhol"
            })
        elif risk_level == "O'RTA":
            recommendations.append({
                "priority": "o'rta",
                "text": "⚠ 3 oy ichida shifokorga murojaat qiling",
                "deadline": "3 oy"
            })
            recommendations.append({
                "priority": "o'rta",
                "text": "⚠ Haftada 3 marta jismoniy mashq qiling",
                "deadline": "darhol"
            })
        else:
            recommendations.append({
                "priority": "past",
                "text": "✅ Yillik tekshiruvlarni davom ettiring",
                "deadline": "yiliga 1 marta"
            })

        if user_data.get('bmi') and user_data['bmi'] > 30:
            recommendations.append({
                "priority": "yuqori",
                "text": "❗ Vaznni kamaytirish bo'yicha parhez",
                "deadline": "darhol"
            })

        return recommendations