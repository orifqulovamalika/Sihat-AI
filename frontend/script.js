// ========== API MANZILI ==========
const API_URL = 'https://sihat-ai-eq7c.onrender.com/api/assess-risk';
const CLINICS_URL = 'https://sihat-ai-eq7c.onrender.com/api/clinics';

let currentLang = 'uz';
let selectedRegion = localStorage.getItem('selectedRegion') || 'Toshkent shahri';

// ========== TIL MA'LUMOTLARI ==========
const texts = {
    uz: {
        tagline: "Sun'iy intellekt asosida sog'lig'ingizni baholang",
        age: "Yosh", gender: "Jins", male: "Erkak", female: "Ayol",
        height: "Bo'y (sm)", weight: "Vazn (kg)", bp: "Qon bosimi",
        smoking: "Chekaman", family: "Oilada kasallik bor",
        submit: "🔍 BAHOLASH", result: "📊 Sog'liq hisoboti",
        sleep: "🌙 Uyqu sifati (1-10)", mood: "😔 Kayfiyat (1-10)",
        alcohol: "🍺 Spirtli ichimlik (haftada)", joint: "🦴 Bo'g'im og'rig'i",
        locationTitle: "📍 Atrofingizdagi klinikalar", specialtyLabel: "🏥 Kasallik turi:",
        findClinics: "🔍 Klinikalarni topish",
        cardiology: "Yurak kasalliklari (Kardiologiya)",
        endocrinology: "Diabet va endokrin kasalliklar",
        neurology: "Nevrologiya (asab tizimi)",
        risk: "Xavf darajasi", score: "Ball", recommendations: "Tavsiyalar", deadline: "Muddat",
        loading: "⏳ Tahlil qilinmoqda...", error: "Serverga ulanishda xatolik!"
    },
    en: {
        tagline: "Assess your health with artificial intelligence",
        age: "Age", gender: "Gender", male: "Male", female: "Female",
        height: "Height (cm)", weight: "Weight (kg)", bp: "Blood pressure",
        smoking: "Smoking", family: "Family history",
        submit: "🔍 ASSESS", result: "📊 Health Report",
        sleep: "🌙 Sleep quality (1-10)", mood: "😔 Mood (1-10)",
        alcohol: "🍺 Alcohol (per week)", joint: "🦴 Joint pain",
        locationTitle: "📍 Nearby clinics", specialtyLabel: "🏥 Specialty:",
        findClinics: "🔍 Find clinics",
        cardiology: "Cardiology", endocrinology: "Endocrinology", neurology: "Neurology",
        risk: "Risk level", score: "Score", recommendations: "Recommendations", deadline: "Deadline",
        loading: "⏳ Analyzing...", error: "Connection error!"
    },
    ru: {
        tagline: "Оцените свое здоровье с помощью ИИ",
        age: "Возраст", gender: "Пол", male: "Мужской", female: "Женский",
        height: "Рост (см)", weight: "Вес (кг)", bp: "Давление",
        smoking: "Курю", family: "Болезни в семье",
        submit: "🔍 ОЦЕНИТЬ", result: "📊 Отчет о здоровье",
        sleep: "🌙 Качество сна (1-10)", mood: "😔 Настроение (1-10)",
        alcohol: "🍺 Алкоголь (в неделю)", joint: "🦴 Боль в суставах",
        locationTitle: "📍 Клиники рядом", specialtyLabel: "🏥 Специальность:",
        findClinics: "🔍 Найти клиники",
        cardiology: "Кардиология", endocrinology: "Эндокринология", neurology: "Неврология",
        risk: "Уровень риска", score: "Балл", recommendations: "Рекомендации", deadline: "Срок",
        loading: "⏳ Анализ...", error: "Ошибка подключения!"
    }
};

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

// ========== VILOYAT MENYUSI ==========
function toggleMenu() {
    const menu = document.getElementById('regionMenu');
    if (menu) menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
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

// ========== SOZLAMALAR MENYUSI ==========
function toggleSettingsMenu() {
    const menu = document.getElementById('settingsMenu');
    if (menu) menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function toggleDarkMode() {
    const toggle = document.getElementById('darkModeToggle');
    if (toggle) {
        if (toggle.checked) document.body.classList.add('dark-mode');
        else document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', toggle.checked);
    }
}

function toggleSaveHistory() {
    const toggle = document.getElementById('saveHistoryToggle');
    if (toggle) localStorage.setItem('saveHistory', toggle.checked);
}

function loadSettingsFromMenu() {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    const saveHistory = localStorage.getItem('saveHistory') === 'true';
    const darkToggle = document.getElementById('darkModeToggle');
    const saveToggle = document.getElementById('saveHistoryToggle');
    if (darkToggle) darkToggle.checked = darkMode;
    if (saveToggle) saveToggle.checked = saveHistory;
    if (darkMode) document.body.classList.add('dark-mode');
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
                html += `<div class="clinic-item"><strong>${clinic.name}</strong><br>📍 ${clinic.address}<br>📞 ${clinic.phone || "Telefon ma'lumoti mavjud emas"}<br>🏛️ ${clinic.type === 'davlat' ? 'Davlat muassasasi' : 'Xususiy klinika'}</div>`;
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
    let riskClass = risk.risk_level === 'YUQORI' ? 'risk-high' : (risk.risk_level === "O'RTA" ? 'risk-medium' : 'risk-low');
    let riskIcon = risk.risk_level === 'YUQORI' ? '🔴' : (risk.risk_level === "O'RTA" ? '🟠' : '🟢');
    let html = `<div class="${riskClass}"><div style="display: flex; justify-content: space-between;"><strong>${riskIcon} ${t.risk}: ${risk.risk_level}</strong><span style="background:white;padding:0.2rem 0.8rem;border-radius:2rem;">${t.score}: ${risk.risk_score}/100</span></div><progress value="${risk.risk_score}" max="100" style="width:100%; height:8px; border-radius:10px; margin-top:8px;"></progress></div><div style="margin: 1rem 0;"><strong>👤 ${t.age}: ${user.age}</strong><br><strong>${t.gender}: ${user.gender === 'male' ? t.male : t.female}</strong><br><strong>BMI:</strong> ${user.bmi} (${user.bmi_category})</div><div><strong>💡 ${t.recommendations}</strong></div>`;
    if (recs && recs.length > 0) {
        recs.forEach(rec => {
            let emoji = rec.priority === 'yuqori' ? '❗' : (rec.priority === "o'rta" ? '⚠️' : '✅');
            html += `<div class="recommendation"><span>${emoji}</span><div><strong>${rec.text}</strong><br><small>📅 ${t.deadline}: ${rec.deadline}</small></div></div>`;
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
        const response = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const result = await response.json();
        if (result.success) {
            displayResult(result.data, resultContent);
            const saveToggle = document.getElementById('saveHistoryToggle');
            if (saveToggle && saveToggle.checked) {
                let history = JSON.parse(localStorage.getItem('healthHistory') || '[]');
                history.unshift({ date: new Date().toLocaleString(), data: data, result: result.data });
                if (history.length > 10) history.pop();
                localStorage.setItem('healthHistory', JSON.stringify(history));
            }
        } else {
            resultContent.innerHTML = `<div class="risk-high">❌ Xatolik: ${result.detail || "Noma'lum xato"}</div>`;
        }
    } catch (error) {
        resultContent.innerHTML = `<div class="risk-high">❌ ${texts[currentLang].error}<br>${error.message}</div>`;
    }
});

// ========== SAHIFA YUKLANGANDA ==========
document.addEventListener('DOMContentLoaded', function() {
    const savedLang = localStorage.getItem('language');
    if (savedLang && texts[savedLang]) changeLanguage(savedLang);
    else changeLanguage('uz');
    loadSettingsFromMenu();
    showSelectedRegion();
    document.addEventListener('click', function(event) {
        const regionMenu = document.getElementById('regionMenu');
        const settingsMenu = document.getElementById('settingsMenu');
        const menuIcon = document.querySelector('.menu-icon');
        const settingsIcon = document.querySelector('.settings-icon');
        if (regionMenu && regionMenu.style.display === 'block') {
            if (menuIcon && !regionMenu.contains(event.target) && !menuIcon.contains(event.target)) regionMenu.style.display = 'none';
        }
        if (settingsMenu && settingsMenu.style.display === 'block') {
            if (settingsIcon && !settingsMenu.contains(event.target) && !settingsIcon.contains(event.target)) settingsMenu.style.display = 'none';
        }
    });
});