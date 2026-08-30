// ── State sesi roasting (dipakai semua modul) ────────────────────

let startTime;
let dryEndTime;
let firstCrackTime;
let endTime;
let timerInterval;
let dryingInterval;
let maillardInterval;
let developmentInterval;
let lockedMaillardTime;

function clearIntervals() {
    clearInterval(timerInterval);
    clearInterval(dryingInterval);
    clearInterval(maillardInterval);
    clearInterval(developmentInterval);
}

function resetSessionState() {
    clearIntervals();
    startTime = null;
    dryEndTime = null;
    firstCrackTime = null;
    endTime = null;
    lockedMaillardTime = null;
}
