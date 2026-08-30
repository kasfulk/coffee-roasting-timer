// ── Chart & rendering roast profile ──────────────────────────────

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

function refreshLogButtonState() {
    logEntryButton.disabled = !(startTime && !endTime) || beanTempInput.value.trim() === '';
}

function renderRoastProfile() {
    // ROR (°C/min) dari dua entri BT berurutan
    let prev = null;
    entries.forEach(entry => {
        if (prev) {
            const dtMin = (entry.t - prev.t) / 60;
            entry.ror = dtMin > 0 ? Math.max(0, (entry.bt - prev.bt) / dtMin) : null;
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

function initChartHandlers() {
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
}
