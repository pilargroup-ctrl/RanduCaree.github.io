const DEFAULT_SECONDS = 4 * 60 * 60;
let remainingSeconds = DEFAULT_SECONDS;
let timerInterval = null;

const timerDisplay = document.getElementById('timerDisplay');
const timerStatus = document.getElementById('timerStatus');
const startBtn = document.getElementById('startBtn');
const demoFastBtn = document.getElementById('demoFastBtn');
const resetBtn = document.getElementById('resetBtn');

function formatTime(sec) {
  const hrs = String(Math.floor(sec / 3600)).padStart(2, '0');
  const mins = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
  const secs = String(sec % 60).padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
}

function runTimer() {
  if (timerInterval) return;
  timerStatus.textContent = 'Status: Plester daun randu aktif bekerja...';
  timerInterval = setInterval(() => {
    if (remainingSeconds > 0) {
      remainingSeconds--;
      timerDisplay.textContent = formatTime(remainingSeconds);
    } else {
      clearInterval(timerInterval);
      timerInterval = null;
      timerStatus.textContent = 'Status: ⏰ WAKTUNYA GANTI PLESTER!';
      alert('⏰ ALARM RANDUCARE: Waktu efektivitas plester telah habis! Silakan ganti plester daun randu dengan yang baru.');
    }
  }, 1000);
}

startBtn.addEventListener('click', () => {
  runTimer();
});

// Tombol Demo Cepat 5 Detik untuk Pengujian Ustadz Prima
demoFastBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  timerInterval = null;
  remainingSeconds = 5;
  timerDisplay.textContent = formatTime(remainingSeconds);
  runTimer();
});

resetBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  timerInterval = null;
  remainingSeconds = DEFAULT_SECONDS;
  timerDisplay.textContent = formatTime(remainingSeconds);
  timerStatus.textContent = 'Status: Siap digunakan';
});

// === GRAFIK SUHU & PERINGATAN DARURAT ===
const tempInput = document.getElementById('tempInput');
const addTempBtn = document.getElementById('addTempBtn');
const clearDataBtn = document.getElementById('clearDataBtn');
const warningBox = document.getElementById('warningBox');

let tempRecords = JSON.parse(localStorage.getItem('randuCareData')) || [
  { time: '08:00', temp: 38.4 },
  { time: '10:00', temp: 37.8 }
];

const ctx = document.getElementById('tempChart').getContext('2d');
const tempChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: tempRecords.map(r => r.time),
    datasets: [{
      label: 'Suhu Tubuh (°C)',
      data: tempRecords.map(r => r.temp),
      borderColor: '#1d63dc',
      backgroundColor: 'rgba(29, 99, 220, 0.12)',
      borderWidth: 3,
      tension: 0.35,
      fill: true,
      pointRadius: 5,
      pointBackgroundColor: '#0b2545'
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { min: 35, max: 41 }
    }
  }
});

function updateChart() {
  tempChart.data.labels = tempRecords.map(r => r.time);
  tempChart.data.datasets[0].data = tempRecords.map(r => r.temp);
  tempChart.update();
  localStorage.setItem('randuCareData', JSON.stringify(tempRecords));
}

addTempBtn.addEventListener('click', () => {
  const val = parseFloat(tempInput.value);
  if (isNaN(val) || val < 34 || val > 43) {
    alert('Masukkan angka suhu yang valid (34°C - 43°C).');
    return;
  }

  if (val > 38.5) {
    warningBox.classList.remove('hidden');
  } else {
    warningBox.classList.add('hidden');
  }

  const now = new Date();
  const timeLabel = now.toTimeString().slice(0, 5);
  tempRecords.push({ time: timeLabel, temp: val });
  updateChart();
  tempInput.value = '';
});

clearDataBtn.addEventListener('click', () => {
  tempRecords = [];
  warningBox.classList.add('hidden');
  updateChart();
});