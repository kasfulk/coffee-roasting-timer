// ── Entry point: inisialisasi semua modul ────────────────────────

// Helpers (formatTime, parseOptional)
// dipakai di phases.js & chart.js → load pertama
// Note: deklarasi fungsi di file terpisah tidak tersedia global di browser
// jadi urutan <script> di HTML harus benar (utils → state → phases → timer → chart → session → buttons)

// Setelah semua modul dimuat, inisialisasi
function init() {
    initChartHandlers();
    initButtonHandlers();
    initSessionHandlers();
}

// Jalankan init setelah DOM ready (script di akhir body sudah menjamin ini)
init();
