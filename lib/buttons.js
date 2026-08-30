// ── UI: buttons ─────────────────────────────────────────────────

const chargeButton = document.getElementById('charge');
const dryEndButton = document.getElementById('dryEnd');
const firstCrackButton = document.getElementById('firstCrack');
const endButton = document.getElementById('end');
const resetButton = document.getElementById('reset');

function setButtonStates() {
    const running = !!startTime && !endTime;
    dryEndButton.disabled = !running || !!dryEndTime;
    firstCrackButton.disabled = !running || !dryEndTime || !!firstCrackTime;
    endButton.disabled = !running;
    resetButton.disabled = !startTime;
}

function initButtonHandlers() {
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

    resetButton.addEventListener('click', () => {
        clearInterval(timerInterval);
        clearInterval(dryingInterval);
        clearInterval(maillardInterval);
        clearInterval(developmentInterval);
        startTime = null;
        dryEndTime = null;
        firstCrackTime = null;
        endTime = null;
        lockedMaillardTime = null;
        entries = [];
        initialWeightInput.value = '';
        resetTimerDisplay();
        resetPhaseIndicators();
        renderRoastProfile();
        setButtonStates();
        localStorage.removeItem(STORAGE_KEY);
    });
}
