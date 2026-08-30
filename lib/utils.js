// ── Helper murni ─────────────────────────────────────────────────

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function parseOptional(value) {
    if (value.trim() === '') return null;
    const n = parseFloat(value);
    return isNaN(n) ? null : n;
}
