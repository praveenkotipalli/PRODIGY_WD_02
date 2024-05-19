let timer;
let startTime;
let elapsedTime = 0;
let isRunning = false;
let laps = JSON.parse(localStorage.getItem('laps')) || [];
const display = document.getElementById('display');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const resetButton = document.getElementById('reset');
const lapButton = document.getElementById('lap');
const lapsContainer = document.getElementById('laps');
const themeToggleButton = document.getElementById('theme-toggle');
let darkMode = JSON.parse(localStorage.getItem('darkMode')) || false;

function formatTime(time) {
    const date = new Date(time);
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    const milliseconds = String(Math.floor(date.getUTCMilliseconds() / 10)).padStart(2, '0');
    return `${minutes}:${seconds}:${milliseconds}`;
}

function updateDisplay() {
    display.textContent = formatTime(elapsedTime);
}

function start() {
    if (isRunning) return;
    isRunning = true;
    startTime = Date.now() - elapsedTime;
    timer = setInterval(() => {
        elapsedTime = Date.now() - startTime;
        updateDisplay();
    }, 10);
    saveState();
}

function stop() {
    if (!isRunning) return;
    isRunning = false;
    clearInterval(timer);
    saveState();
}

function reset() {
    stop();
    elapsedTime = 0;
    laps = [];
    updateDisplay();
    renderLaps();
    saveState();
}

function lap() {
    if (!isRunning) return;
    laps.push(elapsedTime);
    renderLaps();
    saveState();
}

function renderLaps() {
    lapsContainer.innerHTML = laps.map((lapTime, index) => `<li>Lap ${index + 1}: ${formatTime(lapTime)}</li>`).join('');
}

function saveState() {
    localStorage.setItem('elapsedTime', elapsedTime);
    localStorage.setItem('isRunning', isRunning);
    localStorage.setItem('laps', JSON.stringify(laps));
}


function loadState() {
    elapsedTime = Number(localStorage.getItem('elapsedTime')) || 0;
    isRunning = JSON.parse(localStorage.getItem('isRunning')) || false;
    if (isRunning) {
        startTime = Date.now() - elapsedTime;
        start();
    } else {
        updateDisplay();
    }
    renderLaps();
}


function toggleTheme() {
    darkMode = !darkMode;
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('darkMode', darkMode);
    document.querySelector('.hi').textContent=darkMode? 'light💡':'dark🌙';
}

startButton.addEventListener('click', start);
stopButton.addEventListener('click', stop);
resetButton.addEventListener('click', reset);
lapButton.addEventListener('click', lap);
themeToggleButton.addEventListener('click', toggleTheme);

loadState();
toggleTheme();
