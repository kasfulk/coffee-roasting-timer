// ── Fase: drying, maillard, development ──────────────────────────

const dryingRatioDisplay = document.getElementById('dryingRatio');
const maillardRatioDisplay = document.getElementById('maillardRatio');
const developmentRatioDisplay = document.getElementById('developmentRatio');

const dryingProgress = document.getElementById('dryingProgress');
const maillardProgress = document.getElementById('maillardProgress');
const developmentProgress = document.getElementById('developmentProgress');

const dryingIndicator = document.getElementById('dryingIndicator');
const maillardIndicator = document.getElementById('maillardIndicator');
const developmentIndicator = document.getElementById('developmentIndicator');

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
