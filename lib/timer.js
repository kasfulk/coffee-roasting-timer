// ── Timer: start, update, display ────────────────────────────────

const timerDisplay = document.getElementById('timer');

function updateTimer() {
    const currentTime = new Date();
    const elapsedTime = new Date(currentTime - startTime);
    const hours = String(elapsedTime.getUTCHours()).padStart(2, '0');
    const minutes = String(elapsedTime.getUTCMinutes()).padStart(2, '0');
    const seconds = String(elapsedTime.getUTCSeconds()).padStart(2, '0');
    timerDisplay.textContent = `${hours}:${minutes}:${seconds}`;
}

function startTimer() {
    startTime = new Date();
    timerInterval = setInterval(updateTimer, 1000);
    resetPhaseIndicators();
}

function resetTimerDisplay() {
    timerDisplay.textContent = '00:00:00';
}
