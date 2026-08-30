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
    clearIntervals();

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

function initSessionHandlers() {
    (function restoreSession() {
        const saved = loadSession();
        if (!saved || !saved.start) return;
        applySession(saved);
    })();

    initialWeightInput.addEventListener('input', saveSession);
}
