// ========== TIL MA'LUMOTLARI ==========
const texts = {
    uz: {
        tagline: "Sun'iy intellekt asosida sog'lig'ingizni baholang",
        age: "Yosh",
        gender: "Jins",
        male: "Erkak",
        female: "Ayol",
        height: "Bo'y (sm)",
        weight: "Vazn (kg)",
        bp: "Qon bosimi",
        smoking: "Chekaman",
        family: "Oilada kasallik bor",
        submit: "🔍 BAHOLASH",
        result: "📊 Sog'liq hisoboti",
        settings: "⚙️ Sozlamalar",
        saveHistory: "So'rovlar tarixini saqlash",
        darkMode: "Qorong'u rejim",
        saveBtn: "Saqlash"
    },
    en: {
        tagline: "Assess your health with artificial intelligence",
        age: "Age",
        gender: "Gender",
        male: "Male",
        female: "Female",
        height: "Height (cm)",
        weight: "Weight (kg)",
        bp: "Blood pressure",
        smoking: "Smoking",
        family: "Family history",
        submit: "🔍 ASSESS",
        result: "📊 Health Report",
        settings: "⚙️ Settings",
        saveHistory: "Save history",
        darkMode: "Dark mode",
        saveBtn: "Save"
    },
    ru: {
        tagline: "Оцените свое здоровье с помощью ИИ",
        age: "Возраст",
        gender: "Пол",
        male: "Мужской",
        female: "Женский",
        height: "Рост (см)",
        weight: "Вес (кг)",
        bp: "Давление",
        smoking: "Курю",
        family: "Болезни в семье",
        submit: "🔍 ОЦЕНИТЬ",
        result: "📊 Отчет о здоровье",
        settings: "⚙️ Настройки",
        saveHistory: "Сохранять историю",
        darkMode: "Темный режим",
        saveBtn: "Сохранить"
    }
};

let currentLang = 'uz';

function changeLanguage(lang) {
    currentLang = lang;
    const t = texts[lang];
    
    document.getElementById('tagline').innerText = t.tagline;
    document.getElementById('ageLabel').innerText = t.age;
    document.getElementById('genderLabel').innerText = t.gender;
    document.getElementById('maleOption').innerText = t.male;
    document.getElementById('femaleOption').innerText = t.female;
    document.getElementById('heightLabel').innerText = t.height;
    document.getElementById('weightLabel').innerText = t.weight;
    document.getElementById('bpLabel').innerText = t.bp;
    document.getElementById('smokingLabel').innerText = t.smoking;
    document.getElementById('familyLabel').innerText = t.family;
    document.getElementById('submitBtn').innerHTML = t.submit;
    document.getElementById('resultTitle').innerText = t.result;
    document.getElementById('settingsTitle').innerHTML = t.settings;
    document.getElementById('saveHistoryLabel').innerText = t.saveHistory;
    document.getElementById('darkModeLabel').innerText = t.darkMode;
    document.getElementById('saveSettingsBtn').innerText = t.saveBtn;
    
    localStorage.setItem('language', lang);
}

// ========== SOZLAMALAR ==========
function saveSettings() {
    const saveHistory = document.getElementById('saveHistory').checked;
    const darkMode = document.getElementById('darkMode').checked;
    
    localStorage.setItem('saveHistory', saveHistory);
    localStorage.setItem('darkMode', darkMode);
    
    if (darkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    
    alert(texts[currentLang].saveBtn + " ✓");
}

function loadSettings() {
    const saveHistory = localStorage.getItem('saveHistory') === 'true';
    const darkMode = localStorage.getItem('darkMode') === 'true';
    
    document.getElementById('saveHistory').checked = saveHistory;
    document.getElementById('darkMode').checked = darkMode;
    
    if (darkMode) {
        document.body.classList.add('dark-mode');
    }
    
    const savedLang = localStorage.getItem('language');
    if (savedLang && texts[savedLang]) {
        changeLanguage(savedLang);
    } else {
        changeLanguage('uz');
    }
}

// ========== ASOSIY FORMA ==========
document.getElementById('healthForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const data = {
        age: parseInt(document.getElementById('age').value),
        gender: document.getElementById('gender').value,
        height_cm: parseFloat(document.getElementById('height').value),
        weight_kg: parseFloat(document.getElementById('weight').value),
        blood_pressure: document.getElementById('bloodPressure').value || null,
        smoking: document.getElementById('smoking').checked,
        family_history: document.getElementById('familyHistory').checked
    };
    
    const resultDiv = document.getElementById('result');
    const resultContent = document.getElementById('resultContent');
    resultDiv.style.display = 'block';
    resultContent.innerHTML = '⏳ Tahlil qilinmoqda...';
    
    try {
        const response = await fetch('http://127.0.0.1:8000/api/assess-risk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            const d = result.data;
            const risk = d.risk_assessment;
            const user = d.user_info;
            
            let riskClass = risk.risk_level === 'YUQORI' ? 'risk-high' : (risk.risk_level === "O'RTA" ? 'risk-medium' : 'risk-low');
            
            let html = `
                <div class="${riskClass}">
                    <strong>Xavf darajasi: ${risk.risk_level}</strong><br>
                    Ball: ${risk.risk_score}/100
                </div>
                <div>
                    <strong>Yosh:</strong> ${user.age}<br>
                    <strong>Jins:</strong> ${user.gender === 'male' ? 'Erkak' : 'Ayol'}<br>
                    <strong>BMI:</strong> ${user.bmi} (${user.bmi_category})
                </div>
                <div><strong>Tavsiyalar:</strong></div>
            `;
            
            d.recommendations.forEach(rec => {
                html += `<div class="recommendation">❗ ${rec.text}<br><small>Muddat: ${rec.deadline}</small></div>`;
            });
            
            resultContent.innerHTML = html;
        } else {
            resultContent.innerHTML = '<div class="risk-high">Xatolik yuz berdi</div>';
        }
    } catch (error) {
        resultContent.innerHTML = '<div class="risk-high">Serverga ulanishda xatolik! Backend ishlayotganligini tekshiring.</div>';
    }
});

// Sahifa yuklanganda
loadSettings();