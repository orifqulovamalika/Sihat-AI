// ========== API MANZILI (Render uchun) ==========
const API_URL = 'https://sihat-ai-eq7c.onrender.com/api/assess-risk';
const CLINICS_URL = 'https://sihat-ai-eq7c.onrender.com/api/clinics';

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
        error: "Serverga ulanishda xatolik!",
        sleep: "🌙 Uyqu sifati (1-10)",
        mood: "😔 Kayfiyat (1-10)",
        alcohol: "🍺 Spirtli ichimlik (haftada)",
        joint: "🦴 Bo'g'im og'rig'i",
        locationTitle: "📍 Atrofingizdagi klinikalar",
        specialtyLabel: "🏥 Kasallik turi:",
        findClinics: "🔍 Klinikalarni topish",
        cardiology: "Yurak kasalliklari (Kardiologiya)",
        endocrinology: "Diabet va endokrin kasalliklar",
        neurology: "Nevrologiya (asab tizimi)"
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
        error: "Connection error!",
        sleep: "🌙 Sleep quality (1-10)",
        mood: "😔 Mood (1-10)",
        alcohol: "🍺 Alcohol (per week)",
        joint: "🦴 Joint pain",
        locationTitle: "📍 Nearby clinics",
        specialtyLabel: "🏥 Specialty:",
        findClinics: "🔍 Find clinics",
        cardiology: "Cardiology",
        endocrinology: "Endocrinology",
        neurology: "Neurology"
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
        error: "Ошибка подключения!",
        sleep: "🌙 Качество сна (1-10)",
        mood: "😔 Настроение (1-10)",
        alcohol: "🍺 Алкоголь (в неделю)",
        joint: "🦴 Боль в суставах",
        locationTitle: "📍 Клиники рядом",
        specialtyLabel: "🏥 Специальность:",
        findClinics: "🔍 Найти клиники",
        cardiology: "Кардиология",
        endocrinology: "Эндокринология",
        neurology: "Неврология"
    }
};

let currentLang = 'uz';
let selectedRegion = localStorage.getItem('selectedRegion') || 'Toshkent shahri';

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
    document.getElementById('sleepLabel').innerText = t.sleep;
    document.getElementById('moodLabel').innerText = t.mood;
    document.getElementById('alcoholLabel').innerText = t.alcohol;
    document.getElementById('jointLabel').innerText = t.joint;
    document.getElementById('locationTitle').innerHTML = t.locationTitle;
    document.getElementById('specialtyLabel').innerText = t.specialtyLabel;
    
    const specialtySelect = document.getElementById('specialtySelect');
    if (specialtySelect) {
        specialtySelect.options[0].text = t.cardiology;
        specialtySelect.options[1].text = t.endocrinology;
        specialtySelect.options[2].text = t.neurology;
    }
    
    const findBtn = document.querySelector('.clinic-btn');
    if (findBtn) findBtn.innerHTML = t.findClinics;
    
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
    
    const saveHistoryCheckbox = document.getElementById('saveHistory');
    const darkModeCheckbox = document.getElementById('darkMode');
    
    if (saveHistoryCheckbox) saveHistoryCheckbox.checked = saveHistory;
    if (darkModeCheckbox) darkModeCheckbox.checked = darkMode;
    
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

// ========== VILOYAT MENYUSI ==========
function toggleMenu() {
    const menu = document.getElementById('regionMenu');
    if (menu) {
        if (menu.style.display === 'none' || !menu.style.display) {
            menu.style.display = 'block';
        } else {
            menu.style.display = 'none';
        }
    }
}

function selectRegion(region) {
    selectedRegion = region;
    localStorage.setItem('selectedRegion', region);
    toggleMenu();
    showSelectedRegion();
}

function showSelectedRegion() {
    const oldBadge = document.querySelector('.selected-region-badge');
    if (oldBadge) oldBadge.remove();
    
    const header = document.querySelector('.header');
    if (header) {
        const badge = document.createElement('div');
        badge.className = 'selected-region-badge';
        badge.innerHTML = `📍 ${selectedRegion} <span style="font-size:10px;">▼</span>`;
        badge.onclick = toggleMenu;
        header.appendChild(badge);
    }
}

// ========== KLINIKALARNI QIDIRISH ==========
async function findClinics() {
    const specialty = document.getElementById('specialtySelect').value;
    const resultsDiv = document.getElementById('clinicResults');
    
    if (!resultsDiv) return;
    
    resultsDiv.style.display = 'block';
    resultsDiv.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><span>⏳ Klinikalar qidirilmoqda...</span></div>';
    
    try {
        const response = await fetch(`${CLINICS_URL}?specialty=${specialty}&region=${encodeURIComponent(selectedRegion)}`);
        const result = await response.json();
        
        if (result.success && result.data && result.data.length > 0) {
            let html = '<div class="clinic-list"><h4>🏥 Tavsiya etilgan klinikalar:</h4>';
            result.data.forEach(clinic => {
                html += `
                    <div class="clinic-item">
                        <strong>${clinic.name}</strong><br>
                        📍 ${clinic.address}<br>
                        📞 ${clinic.phone || "Telefon ma'lumoti mavjud emas"}<br>
                        🏛️ ${clinic.type === 'davlat' ? 'Davlat muassasasi' : 'Xususiy klinika'}
                    </div>
                `;
            });
            html += '</div>';
            resultsDiv.innerHTML = html;
        } else {
            resultsDiv.innerHTML = `<div class="clinic-not-found">❌ ${result.message || "Ushbu viloyat va ixtisoslik bo‘yicha klinika topilmadi."}</div>`;
        }
    } catch (error) {
        resultsDiv.innerHTML = `<div class="clinic-not-found">❌ Klinikalarni yuklashda xatolik: ${error.message}</div>`;
    }
}

// ========== NATIJANI KO'RSATISH ==========
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
    
    if (recs && recs.length > 0) {
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
    } else {
        html += `<div class="recommendation">✅ Hech qanday tavsiya yo'q</div>`;
    }
    
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
document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
    showSelectedRegion();
    
    // Menyuni tashqariga bosganda yopish
    document.addEventListener('click', function(event) {
        const menu = document.getElementById('regionMenu');
        const menuIcon = document.querySelector('.menu-icon');
        if (menu && menu.style.display === 'block') {
            if (menuIcon && !menu.contains(event.target) && !menuIcon.contains(event.target)) {
                menu.style.display = 'none';
            }
        }
    });
});