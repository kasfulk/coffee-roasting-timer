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

function startTimer() {
    startTime = new Date();
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const currentTime = new Date();
    const elapsedTime = new Date(currentTime - startTime);
    const hours = String(elapsedTime.getUTCHours()).padStart(2, '0');
    const minutes = String(elapsedTime.getUTCMinutes()).padStart(2, '0');
    const seconds = String(elapsedTime.getUTCSeconds()).padStart(2, '0');
    timerDisplay.textContent = `${hours}:${minutes}:${seconds}`;
}

function calculateAndUpdateRatios() {
    const currentTime = endTime || new Date();
    const totalTime = (currentTime - startTime) / 1000; // total time in seconds

    // Calculate Drying Ratio
    if (dryEndTime) {
        const dryingTime = (dryEndTime - startTime) / 1000; // drying time in seconds
        const dryingRatio = (dryingTime / totalTime * 100).toFixed(2); // convert to percentage
        dryingRatioDisplay.textContent = `Drying Ratio: ${(dryingTime / 60).toFixed(2)} minutes (${dryingRatio}%)`;
    }

    // Calculate Maillard Ratio
    if (dryEndTime) {
        const maillardTime = lockedMaillardTime ? lockedMaillardTime : (currentTime - dryEndTime) / 1000; // Maillard phase time in seconds
        const maillardRatio = (maillardTime / totalTime * 100).toFixed(2); // convert to percentage
        maillardRatioDisplay.textContent = `Maillard Ratio: ${(maillardTime / 60).toFixed(2)} minutes (${maillardRatio}%)`;
    }

    // Calculate Development Ratio
    if (firstCrackTime) {
        const developmentTime = (currentTime - firstCrackTime) / 1000; // Development phase time in seconds
        const developmentRatio = (developmentTime / totalTime * 100).toFixed(2); // convert to percentage
        developmentRatioDisplay.textContent = `Development Ratio: ${(developmentTime / 60).toFixed(2)} minutes (${developmentRatio}%)`;
    }
}

chargeButton.addEventListener('click', () => {
    clearInterval(timerInterval);
    clearInterval(dryingInterval);
    clearInterval(maillardInterval);
    clearInterval(developmentInterval);
    startTimer();
    dryingRatioDisplay.textContent = `Drying Ratio: N/A`;
    maillardRatioDisplay.textContent = `Maillard Ratio: N/A`;
    developmentRatioDisplay.textContent = `Development Ratio: N/A`;
    dryingInterval = setInterval(calculateAndUpdateRatios, 1000);
    lockedMaillardTime = null; // Reset locked Maillard time
});

dryEndButton.addEventListener('click', () => {
    dryEndTime = new Date();
    clearInterval(maillardInterval);
    maillardInterval = setInterval(calculateAndUpdateRatios, 1000);
});

firstCrackButton.addEventListener('click', () => {
    firstCrackTime = new Date();
    clearInterval(maillardInterval); // Stop Maillard ratio calculation
    lockedMaillardTime = (firstCrackTime - dryEndTime) / 1000; // Lock Maillard phase time in seconds
    clearInterval(developmentInterval);
    developmentInterval = setInterval(calculateAndUpdateRatios, 1000);
});

endButton.addEventListener('click', () => {
    endTime = new Date();
    clearInterval(timerInterval);
    clearInterval(dryingInterval);
    clearInterval(maillardInterval);
    clearInterval(developmentInterval);
    calculateAndUpdateRatios();
});
