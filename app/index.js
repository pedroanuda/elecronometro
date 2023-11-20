import Cronometro from "./cronometro.js";

const playOrPauseButton = document.getElementById("start_pauseButton");
const stopButton = document.getElementById("stopButton");
const moreButton = document.getElementById("more-button");

const buttonsContent = {
    startButton: `<img src="./img/play.svg" /> Iniciar`,
    pauseButton: `<img src="./img/pause.svg" /> Pausar`,
    resumeButton: `<img src="./img/play.svg" /> Retomar`
};

const cronometro = new Cronometro('stopwatchDisplay');
let started = false;
let paused = false;

function playOrPause() {
    if (!started) {
        started = true;

        playOrPauseButton.innerHTML = buttonsContent.pauseButton;
        playOrPauseButton.classList.toggle("started");

        stopButton.classList.toggle("disabled");
        cronometro.iniciar();
    } else {
        if (paused) cronometro.iniciar();
        else cronometro.pausar();

        paused = !paused;

        playOrPauseButton.innerHTML = paused
        ? buttonsContent.resumeButton
        : buttonsContent.pauseButton
    }

    window.electronAPI.sendSignals({ started, paused })
}

function stop() {
    if (!started) return;

    started = false;
    paused = false;

    playOrPauseButton.classList.toggle("started");
    playOrPauseButton.innerHTML = buttonsContent.startButton;

    stopButton.classList.toggle("disabled");
    cronometro.parar();

    window.electronAPI.sendSignals({ started, paused })
}

playOrPauseButton.addEventListener("click", playOrPause);
stopButton.addEventListener("click", stop);
moreButton.addEventListener("click", event => window.electronAPI.openContextMenu(event.x, event.y));


window.electronAPI.handlePlayOrPause(e => playOrPause());
window.electronAPI.handleStop(e => stop());
