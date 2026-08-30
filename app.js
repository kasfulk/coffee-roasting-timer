let startTime;
let dryEndTime;
let firstCrackTime;
let endTime;
let timerInterval;
let dryingInterval;
let maillardInterval;
let developmentInterval;
let lockedMaillardTime;

const chargeButton = document.getElementById('charge');
const dryEndButton = document.getElementById('dryEnd');
const firstCrackButton = document.getElementById('firstCrack');
const endButton = document.getElementById('end');
const timerDisplay = document.getElementById('timer');

const dryingRatioDisplay = document.getElementById('dryingRatio');
const maillardRatioDisplay = document.getElementById('maillardRatio');
const developmentRatioDisplay = document.getElementById('developmentRatio');

const dryingProgress = document.getElementById('dryingProgress');
const maillardProgress = document.getElementById('maillardProgress');
const developmentProgress = document.getElementById('developmentProgress');

const dryingIndicator = document.getElementById('dryingIndicator');
const maillardIndicator = document.getElementById('maillardIndicator');
const developmentIndicator = document.getElementById('developmentIndicator');

function startTimer() {
    startTime = new Date();
    timerInterval = setInterval(updateTimer, 1000);
    resetPhaseIndicators();
}

function updateTimer() {
    const currentTime = new Date();
    const elapsedTime = new Date(currentTime - startTime);
    const hours = String(elapsedTime.getUTCHours()).padStart(2, '0');
    const minutes = String(elapsedTime.getUTCMinutes()).padStart(2, '0');
    const seconds = String(elapsedTime.getUTCSeconds()).padStart(2, '0');
    timerDisplay.textContent = `${hours}:${minutes}:${seconds}`;
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function setPhaseStatus(element, status) {
    element.classList.remove('active', 'completed');
    if (status === 'active') element.classList.add('active');
    if (status === 'completed') element.classList.add('completed');
}

function resetPhaseIndicators() {
    setPhaseStatus(dryingIndicator, '');
    setPhaseStatus(maillardIndicator, '');
    setPhaseStatus(developmentIndicator, '');
    dryingProgress.style.width = '0%';
    maillardProgress.style.width = '0%';
    developmentProgress.style.width = '0%';
    dryingRatioDisplay.textContent = 'N/A';
    maillardRatioDisplay.textContent = 'N/A';
    developmentRatioDisplay.textContent = 'N/A';
}

function calculateAndUpdateRatios() {
    const currentTime = endTime || new Date();
    const totalTime = (currentTime - startTime) / 1000;

    if (dryEndTime) {
        const dryingTime = (dryEndTime - startTime) / 1000;
        const dryingRatio = (dryingTime / totalTime * 100).toFixed(1);
        dryingRatioDisplay.textContent = `${formatTime(dryingTime)} (${dryingRatio}%)`;
        dryingProgress.style.width = `${dryingRatio}%`;
        setPhaseStatus(dryingIndicator, 'completed');
    } else {
        setPhaseStatus(dryingIndicator, 'active');
    }

    if (dryEndTime) {
        const maillardTime = lockedMaillardTime ? lockedMaillardTime : (currentTime - dryEndTime) / 1000;
        const maillardRatio = (maillardTime / totalTime * 100).toFixed(1);
        maillardRatioDisplay.textContent = `${formatTime(maillardTime)} (${maillardRatio}%)`;
        maillardProgress.style.width = `${maillardRatio}%`;
        
        if (firstCrackTime) {
            setPhaseStatus(maillardIndicator, 'completed');
        } else {
            setPhaseStatus(maillardIndicator, 'active');
        }
    }

    if (firstCrackTime) {
        const developmentTime = (currentTime - firstCrackTime) / 1000;
        const developmentRatio = (developmentTime / totalTime * 100).toFixed(1);
        developmentRatioDisplay.textContent = `${formatTime(developmentTime)} (${developmentRatio}%)`;
        developmentProgress.style.width = `${developmentRatio}%`;
        setPhaseStatus(developmentIndicator, 'active');
    }
}

function setButtonStates() {
    const running = !!startTime && !endTime;
    dryEndButton.disabled = !running || !!dryEndTime;
    firstCrackButton.disabled = !running || !dryEndTime || !!firstCrackTime;
    endButton.disabled = !running;
}

chargeButton.addEventListener('click', () => {
    clearInterval(timerInterval);
    clearInterval(dryingInterval);
    clearInterval(maillardInterval);
    clearInterval(developmentInterval);
    entries = [];
    initialWeightInput.value = '';
    renderRoastProfile();
    endTime = null;
    startTimer();
    dryingInterval = setInterval(calculateAndUpdateRatios, 1000);
    lockedMaillardTime = null;
    setButtonStates();
    saveSession();
});

dryEndButton.addEventListener('click', () => {
    dryEndTime = new Date();
    clearInterval(maillardInterval);
    maillardInterval = setInterval(calculateAndUpdateRatios, 1000);
    calculateAndUpdateRatios();
    setButtonStates();
    saveSession();
});

firstCrackButton.addEventListener('click', () => {
    firstCrackTime = new Date();
    clearInterval(maillardInterval);
    lockedMaillardTime = (firstCrackTime - dryEndTime) / 1000;
    clearInterval(developmentInterval);
    developmentInterval = setInterval(calculateAndUpdateRatios, 1000);
    calculateAndUpdateRatios();
    setButtonStates();
    saveSession();
});

endButton.addEventListener('click', () => {
    endTime = new Date();
    clearInterval(timerInterval);
    clearInterval(dryingInterval);
    clearInterval(maillardInterval);
    clearInterval(developmentInterval);
    renderRoastProfile();
    setButtonStates();
    saveSession();
});

// ── Roast profile: BT, ET, ROR, weight ──────────────────────────
const initialWeightInput = document.getElementById('initialWeight');
const beanTempInput = document.getElementById('beanTemp');
const envTempInput = document.getElementById('envTemp');
const currentWeightInput = document.getElementById('currentWeight');
const logEntryButton = document.getElementById('logEntry');
const undoEntryButton = document.getElementById('undoEntry');
const lastLogDisplay = document.getElementById('lastLog');
const statFinalBt = document.getElementById('statFinalBt');
const statAvgRor = document.getElementById('statAvgRor');
const statPeakRor = document.getElementById('statPeakRor');
const statLoss = document.getElementById('statLoss');
const entryTableBody = document.getElementById('entryTableBody');
const exportButton = document.getElementById('exportSession');
const importButton = document.getElementById('importSession');
const importFile = document.getElementById('importFile');

let entries = [];

const roastChart = new Chart(document.getElementById('roastChart'), {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            { label: 'BT (°C)', data: [], yAxisID: 'temp', borderColor: '#f59e0b', backgroundColor: '#f59e0b', tension: 0.25, pointRadius: 2.5 },
            { label: 'ET (°C)', data: [], yAxisID: 'temp', borderColor: '#3b82f6', backgroundColor: '#3b82f6', tension: 0.25, pointRadius: 2.5, spanGaps: true },
            { label: 'ROR (°C/min)', data: [], yAxisID: 'ror', borderColor: '#22c55e', backgroundColor: '#22c55e', tension: 0.25, pointRadius: 2.5, spanGaps: true, borderDash: [4, 3] },
        ],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        interaction: { mode: 'index', intersect: false },
        scales: {
            x: {
                ticks: { color: '#64748b', font: { size: 9 }, maxRotation: 0, autoSkip: true, maxTicksLimit: 8 },
                grid: { color: 'rgba(51, 65, 85, 0.35)' },
                title: { display: true, text: 'minutes', color: '#64748b', font: { size: 9 } },
            },
            temp: {
                position: 'left',
                ticks: { color: '#94a3b8', font: { size: 9 } },
                grid: { color: 'rgba(51, 65, 85, 0.35)' },
                title: { display: true, text: '°C', color: '#94a3b8', font: { size: 9 } },
            },
            ror: {
                position: 'right',
                ticks: { color: '#94a3b8', font: { size: 9 } },
                grid: { drawOnChartArea: false },
                title: { display: true, text: '°C/min', color: '#94a3b8', font: { size: 9 } },
            },
        },
        plugins: {
            legend: { labels: { color: '#94a3b8', boxWidth: 12, font: { size: 9 } } },
        },
    },
});

function parseOptional(value) {
    if (value.trim() === '') return null;
    const n = parseFloat(value);
    return isNaN(n) ? null : n;
}

function refreshLogButtonState() {
    logEntryButton.disabled = !(startTime && !endTime) || beanTempInput.value.trim() === '';
}

function renderRoastProfile() {
    // ROR (°C/min) dari dua entri BT berurutan
    let prev = null;
    entries.forEach(entry => {
        if (prev) {
            const dtMin = (entry.t - prev.t) / 60;
            entry.ror = dtMin > 0 ? (entry.bt - prev.bt) / dtMin : null;
        }
        prev = entry;
    });

    roastChart.data.labels = entries.map(e => formatTime(e.t));
    roastChart.data.datasets[0].data = entries.map(e => e.bt);
    roastChart.data.datasets[1].data = entries.map(e => e.et);
    roastChart.data.datasets[2].data = entries.map(e => e.ror == null ? null : +e.ror.toFixed(1));
    roastChart.update();

    const initial = parseFloat(initialWeightInput.value);
    entryTableBody.innerHTML = entries.map(e => {
        const loss = (e.weight != null && initial > 0)
            ? `${((initial - e.weight) / initial * 100).toFixed(1)}%`
            : '–';
        return `<tr>
            <td>${formatTime(e.t)}</td>
            <td>${e.bt.toFixed(1)}</td>
            <td>${e.et == null ? '–' : e.et.toFixed(1)}</td>
            <td>${e.ror == null ? '–' : e.ror.toFixed(1)}</td>
            <td>${e.weight == null ? '–' : e.weight}</td>
            <td>${loss}</td>
        </tr>`;
    }).join('');

    const last = entries[entries.length - 1];
    statFinalBt.textContent = last ? `${last.bt.toFixed(1)} °C` : '–';
    const rors = entries.map(e => e.ror).filter(r => r != null);
    statAvgRor.textContent = rors.length
        ? `${(rors.reduce((a, b) => a + b, 0) / rors.length).toFixed(1)} °C/min`
        : '–';
    statPeakRor.textContent = rors.length ? `${Math.max(...rors).toFixed(1)} °C/min` : '–';
    const weights = entries.map(e => e.weight).filter(w => w != null);
    statLoss.textContent = (weights.length && initial > 0)
        ? `${((initial - weights[weights.length - 1]) / initial * 100).toFixed(1)}% (${(initial - weights[weights.length - 1]).toFixed(0)} g)`
        : '–';

    lastLogDisplay.textContent = entries.length ? `${entries.length} logs` : '';
    undoEntryButton.disabled = entries.length === 0;
    exportButton.disabled = entries.length === 0;
    refreshLogButtonState();
}

function logEntry() {
    const bt = parseFloat(beanTempInput.value);
    if (!startTime || endTime || isNaN(bt)) return;

    entries.push({
        t: (new Date() - startTime) / 1000,
        bt,
        et: parseOptional(envTempInput.value),
        weight: parseOptional(currentWeightInput.value),
        ror: null,
    });
    beanTempInput.value = '';
    envTempInput.value = '';
    currentWeightInput.value = '';
    renderRoastProfile();
    saveSession();
    beanTempInput.focus();
}

logEntryButton.addEventListener('click', logEntry);

[initialWeightInput, beanTempInput, envTempInput, currentWeightInput].forEach(input => {
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            logEntry();
        }
    });
});

undoEntryButton.addEventListener('click', () => {
    if (!entries.length) return;
    entries.pop();
    renderRoastProfile();
    saveSession();
});
exportButton.addEventListener('click', () => {
    if (!startTime || !entries.length) return;
    const data = {
        start: startTime.getTime(),
        dryEnd: dryEndTime ? dryEndTime.getTime() : null,
        firstCrack: firstCrackTime ? firstCrackTime.getTime() : null,
        end: endTime ? endTime.getTime() : null,
        entries,
        greenWeight: initialWeightInput.value,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const d = new Date(startTime);
    const pad = n => String(n).padStart(2, '0');
    const link = document.createElement('a');
    link.href = url;
    link.download = `roast-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${pad(d.getHours())}-${pad(d.getMinutes())}.json`;
    link.click();
    URL.revokeObjectURL(url);
});

importButton.addEventListener('click', () => importFile.click());

importFile.addEventListener('change', () => {
    const file = importFile.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
        try {
            const data = JSON.parse(reader.result);
            const valid = data && Number.isFinite(data.start)
                && Array.isArray(data.entries) && data.entries.length
                && data.entries.every(e => Number.isFinite(e.t) && Number.isFinite(e.bt));
            if (!valid) throw new Error('invalid');
            if (confirm('Muat profile ini? Sesi saat ini akan ditimpa.')) {
                applySession(data);
                saveSession();
            }
        } catch (err) {
            alert('File profile tidak valid.');
        } finally {
            importFile.value = '';
        }
    };
    reader.onerror = () => alert('Gagal membaca file.');
    reader.readAsText(file);
});

beanTempInput.addEventListener('input', refreshLogButtonState);

// ── Persist sesi + log ke localStorage ──────────────────────────
const STORAGE_KEY = 'roastSession';

function saveSession() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            start: startTime ? startTime.getTime() : null,
            dryEnd: dryEndTime ? dryEndTime.getTime() : null,
            firstCrack: firstCrackTime ? firstCrackTime.getTime() : null,
            end: endTime ? endTime.getTime() : null,
            entries,
            greenWeight: initialWeightInput.value,
        }));
    } catch (e) {
        // storage penuh / private mode — abaikan
    }
}

function loadSession() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        return null;
    }
}

function applySession(saved) {
    clearInterval(timerInterval);
    clearInterval(dryingInterval);
    clearInterval(maillardInterval);
    clearInterval(developmentInterval);

    startTime = new Date(saved.start);
    dryEndTime = saved.dryEnd ? new Date(saved.dryEnd) : null;
    firstCrackTime = saved.firstCrack ? new Date(saved.firstCrack) : null;
    endTime = saved.end ? new Date(saved.end) : null;
    entries = Array.isArray(saved.entries) ? saved.entries : [];
    initialWeightInput.value = saved.greenWeight || '';

    updateTimer();
    calculateAndUpdateRatios();
    renderRoastProfile();
    setButtonStates();
    refreshLogButtonState();

    if (!endTime) {
        lockedMaillardTime = (firstCrackTime && dryEndTime) ? (firstCrackTime - dryEndTime) / 1000 : null;
        timerInterval = setInterval(updateTimer, 1000);
        dryingInterval = setInterval(calculateAndUpdateRatios, 1000);
    }
}

(function restoreSession() {
    const saved = loadSession();
    if (!saved || !saved.start) return;
    applySession(saved);
})();

initialWeightInput.addEventListener('input', saveSession);
