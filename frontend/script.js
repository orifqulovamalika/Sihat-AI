// ========== API MANZILI (Render uchun) ==========
const API_URL = 'https://sihat-ai-eq7c.onrender.com/api/assess-risk';
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
        saveBtn: "Saqlash",
        risk: "Xavf darajasi",
        score: "Ball",
        recommendations: "Tavsiyalar",
        deadline: "Muddat",
        loading: "⏳ Tahlil qilinmoqda...",
        error: "Serverga ulanishda xatolik! Backend ishlayotganligini tekshiring."
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
        saveBtn: "Save",
        risk: "Risk level",
        score: "Score",
        recommendations: "Recommendations",
        deadline: "Deadline",
        loading: "⏳ Analyzing...",
        error: "Connection error! Please check if backend is running."
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
        saveBtn: "Сохранить",
        risk: "Уровень риска",
        score: "Балл",
        recommendations: "Рекомендации",
        deadline: "Срок",
        loading: "⏳ Анализ...",
        error: "Ошибка подключения! Проверьте работу бэкенда."
    }
};

let currentLang = 'uz';

// ========== TILNI O'ZGARTIRISH ==========
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

// ========== SOZLAMALARNI SAQLASH ==========
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

// ========== SOZLAMALARNI YUKLASH ==========
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

// ========== NATIJANI CHIROYLI KO'RSATISH ==========
function displayResult(data, container) {
    const risk = data.risk_assessment;
    const user = data.user_info;
    const recs = data.recommendations;
    const t = texts[currentLang];
    
    let riskClass = '';
    let riskIcon = '';
    if (risk.risk_level === 'YUQORI') {
        riskClass = 'risk-high';
        riskIcon = '🔴';
    } else if (risk.risk_level === "O'RTA") {
        riskClass = 'risk-medium';
        riskIcon = '🟠';
    } else {
        riskClass = 'risk-low';
        riskIcon = '🟢';
    }
    
    let html = `
        <div class="${riskClass}">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <strong>${riskIcon} ${t.risk}: ${risk.risk_level}</strong>
                <span style="background: white; padding: 0.2rem 0.8rem; border-radius: 2rem;">${t.score}: ${risk.risk_score}/100</span>
            </div>
            <progress value="${risk.risk_score}" max="100" style="width:100%; height:8px; border-radius:10px; margin-top:8px;"></progress>
        </div>
        
        <div style="margin: 1rem 0;">
            <strong>👤 ${t.age}: ${user.age}</strong><br>
            <strong>${t.gender}: ${user.gender === 'male' ? t.male : t.female}</strong><br>
            <strong>BMI:</strong> ${user.bmi} (${user.bmi_category})
        </div>
        
        <div><strong>💡 ${t.recommendations}</strong></div>
    `;
    
    recs.forEach(rec => {
        let priorityEmoji = rec.priority === 'yuqori' ? '❗' : (rec.priority === "o'rta" ? '⚠️' : '✅');
        html += `
            <div class="recommendation">
                <span>${priorityEmoji}</span>
                <div>
                    <strong>${rec.text}</strong><br>
                    <small>📅 ${t.deadline}: ${rec.deadline}</small>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
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
    family_history: document.getElementById('familyHistory').checked,
    sleep_quality: parseInt(document.getElementById('sleepQuality').value),
    mood: parseInt(document.getElementById('mood').value),
    alcohol: parseInt(document.getElementById('alcohol').value),
    joint_pain: parseInt(document.getElementById('jointPain').value)
};
    
    const resultDiv = document.getElementById('result');
    const resultContent = document.getElementById('resultContent');
    resultDiv.style.display = 'block';
    resultContent.innerHTML = `<div class="loading-spinner"><div class="spinner"></div><span>${texts[currentLang].loading}</span></div>`;
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            displayResult(result.data, resultContent);
            
            if (document.getElementById('saveHistory').checked) {
                let history = JSON.parse(localStorage.getItem('healthHistory') || '[]');
                history.unshift({
                    date: new Date().toLocaleString(),
                    data: data,
                    result: result.data
                });
                if (history.length > 10) history.pop();
                localStorage.setItem('healthHistory', JSON.stringify(history));
            }
        } else {
            resultContent.innerHTML = `<div class="risk-high">❌ Xatolik: ${result.detail || "Noma'lum xato"}</div>`;
        }
    } catch (error) {
        console.error('Fetch error:', error);
        resultContent.innerHTML = `<div class="risk-high">❌ ${texts[currentLang].error}<br>${error.message}</div>`;
    }
});

// ========== SAHIFA YUKLANGANDA ==========
loadSettings();