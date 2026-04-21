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

// ========== FAVQULODDA HOLATLAR (20 TA) - KASALLIK ASORATLARI BILAN ==========
const symptomsData = {
    koz_qorongilashishi: { 
        name: "Ko'z oldi qorong'ilashishi", 
        possible: ["Gipertonik kriz", "Bosh miya qon aylanishi buzilishi", "Qon bosimi keskin o'zgarishi", "Ortostatik gipotenziya", "Anemiya"], 
        action: "Darhol qon bosimini o'lchang. O'tiring yoki yoting. Agar bosim 180/120 dan yuqori bo'lsa, tez yordam chaqiring!", 
        risk: "yuqori",
        complications: "Agar davolanmasa: insult, yurak xuruji, ko'rish qobiliyatini yo'qotish, buyrak yetishmovchiligi"
    },
    bosh_aylanishi: { 
        name: "Bosh aylanishi", 
        possible: ["Vestibulyar apparat buzilishi", "Qon bosimi pastligi", "Anemiya", "Qon tomir muammolari", "Diabet", "Stress"], 
        action: "O'tiring yoki yoting. Sekin-asta suv iching. Biror narsaga mahkam ushlang.", 
        risk: "o'rta",
        complications: "Uzoq davom etsa: yiqilish, jarohatlar, ish qobiliyatini yo'qotish, depressiya"
    },
    kongil_aynishi: { 
        name: "Ko'ngil aynishi", 
        possible: ["Oshqozon-ichak muammolari", "Gipertoniya", "Meniere kasalligi", "Stress", "Homiladorlik", "Ovqat zaharlanishi"], 
        action: "Toza havoga chiqing. Yalpiz choyi iching. Agar qusish bo'lsa, tez yordam chaqiring.", 
        risk: "o'rta",
        complications: "Suvsizlanish, elektrolitlar buzilishi, ovqatlanish buzilishi"
    },
    kuchli_bosh_ogrigi: { 
        name: "Kuchli bosh og'rig'i", 
        possible: ["Migren", "Gipertoniya", "Bosh miya bosimi oshishi", "Klasterli og'riq", "Meningit"], 
        action: "Qorong'i xonada dam oling. Sovuq kompress qo'ying. Agar og'riq kuchli bo'lsa, tez yordam chaqiring.", 
        risk: "yuqori",
        complications: "Miya shishi, insult, ko'rish buzilishi, hayot sifatining pasayishi"
    },
    kokrak_ogrigi: { 
        name: "Ko'krak og'rig'i", 
        possible: ["Yurak xuruji", "Angina pektoris", "O'pka emboliyasi", "Perikardit", "Plevrit"], 
        action: "🚨 SHOSHILINCH! Tez yordam chaqiring (103). O'tirgan holatda turing.", 
        risk: "hayotiy",
        complications: "Yurak to'xtashi, miokard infarkti, o'lim, yurak yetishmovchiligi"
    },
    nafas_qisishi: { 
        name: "Nafas qisishi", 
        possible: ["Astma", "Yurak yetishmovchiligi", "Pnevmoniya", "Allergiya", "COVID-19"], 
        action: "O'tirgan holatda nafas olishga harakat qiling. Derazani oching.", 
        risk: "yuqori",
        complications: "Gipoksiya, o'pka fibrozi, nafas yetishmovchiligi, o'lim"
    },
    qulog_shangillashi: { 
        name: "Quloq shang'illashi", 
        possible: ["Qon bosimi oshishi", "Quloq infeksiyasi", "Meniere kasalligi", "Tinnitus"], 
        action: "Qon bosimingizni o'lchang. Tinch xonada dam oling.", 
        risk: "o'rta",
        complications: "Eshitish qobiliyatini yo'qotish, doimiy shovqin, uyqusizlik, depressiya"
    },
    yurak_urishi: { 
        name: "Yurak tez urishi", 
        possible: ["Taxikardiya", "Aritmiya", "Qalqonsimon bez kasalligi", "Anemiya", "Stress"], 
        action: "Tinch xonada o'tiring. Chuqur nafas oling. Agar 10 daqiqadan o'tmasa, tez yordam chaqiring.", 
        risk: "yuqori",
        complications: "Yurak yetishmovchiligi, insult, yurak to'xtashi, qon quyqalari"
    },
    qon_ketishi: { 
        name: "Qon ketishi", 
        possible: ["Travma", "Yara", "Operatsiyadan keyingi asorat", "Ichki qon ketish"], 
        action: "🚨 SHOSHILINCH! Qon ketish joyiga toza mato bosib turing. Tez yordam chaqiring (103)!", 
        risk: "hayotiy",
        complications: "Ko'p qon yo'qotish, anemiya, shok, o'lim"
    },
    hushidan_ketish: { 
        name: "Hushidan ketish", 
        possible: ["Qon bosimi keskin pasayishi", "Yurak muammolari", "Epilepsiya", "Qand miqdorining pasayishi"], 
        action: "🚨 SHOSHILINCH! Tez yordam chaqiring (103)! Shaxsni yonbosh yotqizib, nafas olishini tekshiring.", 
        risk: "hayotiy",
        complications: "Bosh miya shikastlanishi, yiqilish jarohatlari, epilepsiya rivojlanishi"
    },
    tana_tirishishi: { 
        name: "Tana qattiq taranglashishi", 
        possible: ["Epilepsiya", "Isitma", "Meningit", "Tetanus", "Elektrolitlar buzilishi"], 
        action: "🚨 SHOSHILINCH! Tez yordam chaqiring (103)! Shaxsni yonbosh yotqizib, og'ziga hech narsa solmang.", 
        risk: "hayotiy",
        complications: "Miya shikastlanishi, nafas to'xtashi, o'lim"
    },
    qattiq_titrash: { 
        name: "Qattiq titrash", 
        possible: ["Isitma", "Sepsis", "Gipotermiya", "Malariya", "Infeksiya"], 
        action: "Issiq adyol bilan yoping. Isitmani o'lchang. Agar 39°C dan yuqori bo'lsa, tez yordam chaqiring.", 
        risk: "yuqori",
        complications: "Sepsis, organ yetishmovchiligi, o'lim"
    },
    gapirish_qiyinlashi: { 
        name: "Gapirish qiyinlashishi", 
        possible: ["Insult", "Bosh miya shikastlanishi", "Nevrologik kasallik"], 
        action: "🚨 SHOSHILINCH! Tez yordam chaqiring (103)! Insult belgilari: yuz tirishishi, qo'l zaifligi.", 
        risk: "hayotiy",
        complications: "Doimiy nutq buzilishi, falaj, o'lim"
    },
    yuz_tirishishi: { 
        name: "Yuz qattiq taranglashishi", 
        possible: ["Insult", "Bell palsi", "Nevrit", "Bosh miya shikastlanishi"], 
        action: "🚨 SHOSHILINCH! Tez yordam chaqiring (103)! Tabassum qilishga harakat qiling.", 
        risk: "hayotiy",
        complications: "Doimiy yuz falaji, ovqatlanish qiyinlishuvi, depressiya"
    },
    qol_oyoq_shishi: { 
        name: "Qo'l-oyoq shishi", 
        possible: ["Yurak yetishmovchiligi", "Buyrak yetishmovchiligi", "Jigar sirozi", "Tromboz"], 
        action: "Oyoqlarni baland ko'taring. Tuzni kamaytiring. Agar bir oyog'ingiz shishgan bo'lsa, tez yordam chaqiring.", 
        risk: "yuqori",
        complications: "Tromboz, o'pka emboliyasi, yurak yetishmovchiligi"
    },
    teri_qizarishi: { 
        name: "Teri qizarishi", 
        possible: ["Allergiya", "Infeksiya", "Autoimmun kasallik", "Quyosh yonishi"], 
        action: "Antigistamin qabul qiling. Sovuq kompress qo'ying. Agar nafas qisishi bilan birga bo'lsa, tez yordam chaqiring.", 
        risk: "o'rta",
        complications: "Anafilaktik shok, teri yaralari, infeksiya tarqalishi"
    },
    isitma: { 
        name: "Isitma (38°C dan yuqori)", 
        possible: ["Virusli infeksiya", "Bakterial infeksiya", "Sepsis", "Gripp"], 
        action: "Ko'p suv iching. Paratsetamol qabul qiling. Agar 3 kundan oshsa yoki 40°C dan yuqori bo'lsa, tez yordam chaqiring.", 
        risk: "yuqori",
        complications: "Sepsis, organ yetishmovchiligi, konvulsiya (bolalarda)"
    },
    qusish: { 
        name: "Qusish", 
        possible: ["Ovqat zaharlanishi", "Oshqozon-ichak infeksiyasi", "Migren", "Homiladorlik"], 
        action: "Kichik yudumlarda suv iching. Agar qonda qusish yoki 24 soatdan oshsa, tez yordam chaqiring.", 
        risk: "o'rta",
        complications: "Suvsizlanish, elektrolitlar buzilishi, Mallory-Veys sindromi"
    },
    ich_ketishi: { 
        name: "Ich ketishi", 
        possible: ["Ovqat zaharlanishi", "Infeksiya", "IBS", "Antibiotiklar"], 
        action: "Ko'p suv iching. Oralit iching. Agar qonda bo'lsa yoki 3 kundan oshsa, shifokorga murojaat qiling.", 
        risk: "o'rta",
        complications: "Suvsizlanish, elektrolitlar buzilishi, gipotension shok"
    },
    qorin_ogrigi: { 
        name: "Qorin og'rig'i", 
        possible: ["Appenditsit", "Oshqozon yarasi", "Pankreatit", "Xoletsistit", "Buyrak toshi"], 
        action: "Agar og'riq o'ng pastki tomonda bo'lsa, appenditsit bo'lishi mumkin. Darhol shifokorga murojaat qiling.", 
        risk: "yuqori",
        complications: "Appenditsit yorilishi, peritonit, sepsis, o'lim"
    }
};

function checkSymptom(symptom) {
    const resultDiv = document.getElementById('symptomResult');
    const bp = document.getElementById('bloodPressure').value;
    const symData = symptomsData[symptom];
    if (!symData) return;
    
    let diagnosis = symData.possible.join(", ");
    let recommendation = symData.action;
    let riskLevel = symData.risk;
    let complications = symData.complications;
    
    if (bp) {
        const systolic = parseInt(bp.split('/')[0]);
        if (systolic > 180 && (symptom === 'koz_qorongilashishi' || symptom === 'kuchli_bosh_ogrigi')) {
            riskLevel = "hayotiy";
            recommendation = "🚨 SHOSHILINCH! Qon bosimi juda yuqori! Tez yordam chaqiring (103)!";
        }
    }
    
    let riskText = riskLevel === "hayotiy" ? "🚨 HAYOTIY XAVF!" : (riskLevel === "yuqori" ? "🔴 YUQORI XAVF" : "🟡 O'RTA XAVF");
    let riskColor = riskLevel === "hayotiy" ? "#d32f2f" : (riskLevel === "yuqori" ? "#f44336" : "#ff9800");
    let riskClass = riskLevel === "hayotiy" ? "symptom-high-risk" : (riskLevel === "yuqori" ? "symptom-high-risk" : "symptom-medium-risk");
    
    let html = `<div class="${riskClass}" style="border-left-color: ${riskColor};">
        <strong>⚠️ Semptom:</strong> ${symData.name}<br>
        <strong>🏥 Mumkin bo'lgan kasalliklar:</strong> ${diagnosis}<br>
        <strong>📊 Xavf darajasi:</strong> <span style="color:${riskColor};">${riskText}</span><br>
        <strong>💊 Tavsiya:</strong> ${recommendation}<br>
        <div class="complications">
            <strong>⚠️ KASALLIK ASORATLARI (davolanmasa):</strong><br>
            ${complications}
        </div>
        ${riskLevel === "hayotiy" ? '<strong style="color:#d32f2f; display:block; margin-top:0.5rem;">🚨 DARHOL TEZ YORDAM CHAQIRING! (103)</strong>' : ''}
    </div>`;
    resultDiv.innerHTML = html;
    resultDiv.style.display = 'block';
}// ========== TEZ YORDAM ==========
function callAmbulance() {
    const resultDiv = document.getElementById('ambulanceResult');
    const userLocation = selectedRegion || "Viloyat tanlanmagan";
    const userAge = document.getElementById('age').value;
    
    resultDiv.innerHTML = `<div style="background:#e8f5e9; padding:1rem; border-radius:0.8rem;">
        <strong>🚨 TEZ YORDAM SO'ROVI YUBORILDI!</strong><br>
        📍 Joylashuv: ${userLocation}<br>
        👤 Yosh: ${userAge}<br><br>
        <strong>📞 Iltimos, 103 raqamiga qo'ng'iroq qiling!</strong><br>
        <button onclick="window.location.href='tel:103'" style="background:#4caf50; color:white; border:none; padding:0.8rem 1.5rem; border-radius:2rem; cursor:pointer; margin-top:0.8rem;">📞 TEZ YORDAMGA QO'NG'IROQ QILISH (103)</button>
    </div>`;
    resultDiv.style.display = 'block';
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
if (document.getElementById('healthForm')) {
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
            } else {
                resultContent.innerHTML = `<div class="risk-high">❌ Xatolik: ${result.detail || "Noma'lum xato"}</div>`;
            }
        } catch (error) {
            resultContent.innerHTML = `<div class="risk-high">❌ ${texts[currentLang].error}<br>${error.message}</div>`;
        }
    });
}

// ========== SAHIFA YUKLANGANDA ==========
document.addEventListener('DOMContentLoaded', function() {
    const savedLang = localStorage.getItem('language');
    if (savedLang && texts[savedLang]) changeLanguage(savedLang);
    else changeLanguage('uz');
    showSelectedRegion();
    
    document.addEventListener('click', function(event) {
        const regionMenu = document.getElementById('regionMenu');
        const menuIcon = document.querySelector('.menu-icon');
        if (regionMenu && regionMenu.style.display === 'block') {
            if (menuIcon && !regionMenu.contains(event.target) && !menuIcon.contains(event.target)) {
                regionMenu.style.display = 'none';
            }
        }
    });
});
// ========== BIR NECHTA SEMPTOMLARNI TAShXIS QILISH ==========
function diagnoseMultipleSymptoms() {
    const checkboxes = document.querySelectorAll('.symptom-checkbox:checked');
    const selectedSymptoms = Array.from(checkboxes).map(cb => cb.value);
    const resultDiv = document.getElementById('multiDiagnosisResult');
    
    if (selectedSymptoms.length === 0) {
        resultDiv.innerHTML = '<div style="background:#fff3cd; padding:1rem; border-radius:0.8rem; color:#856404;">⚠️ Iltimos, kamida bitta semptomni tanlang!</div>';
        resultDiv.style.display = 'block';
        return;
    }
    
    // Semptomlarni tahlil qilish
    const analysis = analyzeSymptoms(selectedSymptoms);
    
    let html = `
        <div style="margin-bottom: 1rem;">
            <strong>📋 Tanlangan semptomlar (${selectedSymptoms.length}):</strong><br>
            ${selectedSymptoms.map(s => symptomsData[s]?.name || s).join(', ')}
        </div>
        <div><strong>🔬 TAShXIS NATIJALARI:</strong></div>
    `;
    
    // Eng yuqori xavf darajasidagi kasalliklarni chiqarish
    if (analysis.possibleDiseases.length > 0) {
        html += `<div class="diagnosis-disease diagnosis-${analysis.overallRisk}-risk">
            <strong>🏥 Mumkin bo'lgan kasalliklar:</strong><br>
            ${analysis.possibleDiseases.map(d => `• ${d.name} (${d.matchCount} ta semptom)`).join('<br>')}
        </div>`;
    }
    
    // Umumiy xavf darajasi
    html += `<div class="diagnosis-disease diagnosis-${analysis.overallRisk}-risk">
        <strong>📊 Umumiy xavf darajasi:</strong> ${getRiskText(analysis.overallRisk)}
    </div>`;
    
    // Tavsiyalar
    html += `<div class="diagnosis-disease">
        <strong>💊 Tavsiyalar:</strong><br>
        ${analysis.recommendations.join('<br>')}
    </div>`;
    
    // Asoratlar
    if (analysis.complications.length > 0) {
        html += `<div class="diagnosis-disease">
            <strong>⚠️ Mumkin bo'lgan asoratlar:</strong><br>
            ${analysis.complications.slice(0, 5).join('<br>')}
        </div>`;
    }
    
    // Tez yordam tavsiyasi
    if (analysis.overallRisk === 'high' || analysis.overallRisk === 'hayotiy') {
        html += `<div style="background:#ffebee; padding:1rem; border-radius:0.8rem; margin-top:0.8rem; border-left:4px solid #d32f2f;">
            <strong style="color:#d32f2f;">🚨 DARHOL SHIFOKORGA MUROJAAT QILING! </strong>
            <button onclick="callAmbulance()" style="background:#d32f2f; color:white; border:none; padding:0.5rem 1rem; border-radius:2rem; margin-left:0.5rem; cursor:pointer;">📞 TEZ YORDAM (103)</button>
        </div>`;
    }
    
    resultDiv.innerHTML = html;
    resultDiv.style.display = 'block';
}

function analyzeSymptoms(symptomIds) {
    const possibleDiseases = new Map(); // kasallik nomi -> {count, risks, complications}
    const allComplications = [];
    
    symptomIds.forEach(symptomId => {
        const symptom = symptomsData[symptomId];
        if (symptom) {
            symptom.possible.forEach(disease => {
                if (!possibleDiseases.has(disease)) {
                    possibleDiseases.set(disease, { count: 0, risks: [], complications: [] });
                }
                const data = possibleDiseases.get(disease);
                data.count++;
                data.risks.push(symptom.risk);
                if (symptom.complications) {
                    data.complications.push(symptom.complications);
                    allComplications.push(symptom.complications);
                }
            });
        }
    });
    
    // Kasalliklarni moslik soni bo'yicha saralash
    const sortedDiseases = Array.from(possibleDiseases.entries())
        .map(([name, data]) => ({ name, matchCount: data.count, risks: data.risks, complications: data.complications }))
        .sort((a, b) => b.matchCount - a.matchCount)
        .slice(0, 5); // Eng ko'p 5 ta kasallik
    
    // Umumiy xavf darajasini aniqlash
    const allRisks = sortedDiseases.flatMap(d => d.risks);
    let overallRisk = 'low';
    if (allRisks.includes('hayotiy')) {
        overallRisk = 'hayotiy';
    } else if (allRisks.includes('yuqori')) {
        overallRisk = 'high';
    } else if (allRisks.includes('o\'rta')) {
        overallRisk = 'medium';
    }
    
    // Tavsiyalar
    const recommendations = [];
    if (overallRisk === 'hayotiy') {
        recommendations.push('🚨 SHOSHILINCH! Tez yordam chaqiring (103)!');
        recommendations.push('🏥 Darhol shifoxonaga murojaat qiling');
    } else if (overallRisk === 'high') {
        recommendations.push('⚠️ 24 soat ichida shifokorga murojaat qiling');
        recommendations.push('🩺 Qon bosimi va qand miqdorini tekshiring');
    } else {
        recommendations.push('📅 1 hafta ichida shifokorga murojaat qiling');
        recommendations.push('💪 Sog\'lom turmush tarziga o\'ting');
    }
    
    if (symptomIds.includes('kokrak_ogrigi') || symptomIds.includes('nafas_qisishi')) {
        recommendations.push('❤️ Yurak va o\'pka tekshiruvidan o\'ting');
    }
    if (symptomIds.includes('bosh_aylanishi') || symptomIds.includes('hushidan_ketish')) {
        recommendations.push('🧠 Nevrologga murojaat qiling');
    }
    if (symptomIds.includes('qon_ketishi')) {
        recommendations.push('🩸 Gemoglobin va qon ivish tekshiruvidan o\'ting');
    }
    
    return {
        possibleDiseases: sortedDiseases,
        overallRisk: overallRisk,
        recommendations: recommendations,
        complications: [...new Set(allComplications)]
    };
}

function getRiskText(risk) {
    switch(risk) {
        case 'hayotiy': return '🚨 HAYOTIY XAVF! Darhol tez yordam chaqiring!';
        case 'high': return '🔴 YUQORI XAVF - Shifokorga murojaat qiling';
        case 'medium': return '🟡 O\'RTA XAVF - Kuzatuvda bo\'ling';
        default: return '🟢 PAST XAVF - Profilaktik tekshiruv';
    }
}