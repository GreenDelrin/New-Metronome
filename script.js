// Hamburger menu

const menuBtn = document.querySelector(".menu-btn");
const menu = document.querySelector(".menu");

let menuOpen = false;
menuBtn.addEventListener("click", () => {
    if (!menuOpen) {
        menu.classList.add("menu--open");
        menuOpen = true;
    } else {
        menu.classList.remove("menu--open");
        menuOpen = false;
    }
});


//Metronome app
const circle = document.querySelector('.circle');
const bpmInput = document.getElementById("bpmInput");
const beatsPerBarInput = document.getElementById("beatsPerBarInput");
const numOfBeats = document.getElementById("numOfBeats");
//const whatBeat = document.getElementById("whatBeat");
const startStopButton = document.getElementById("startStopButton");
const bpmMinus = document.getElementById('bpm-minus');
const bpmPlus = document.getElementById('bpm-plus');
const jazzBtn = document.getElementById('jazzBtn');
const audioContext = new AudioContext();
let playingMetronome = false;
document.getElementById("startStopButton").style.background = "red";
let oscillator;
var count = 1;

bpmMinus.addEventListener("click", function () {
    bpmInput.value = parseInt(bpmInput.value) - 5;
    updateBPM();
});

bpmPlus.addEventListener("click", function () {
    bpmInput.value = parseInt(bpmInput.value) + 5;
    updateBPM();
});

var jazzMode = false;
jazzBtn.addEventListener("click", function () {
    if (jazzMode == false) {
        jazzMode = true;
        document.getElementById("jazzBtn").style.background = "navy";
        jazzBtn.innerText = "Jazz:On";
    } else if (jazzMode == true) {
        jazzMode = false;
        document.getElementById("jazzBtn").style.background = "rgb(166, 166, 166)";
        jazzBtn.innerText = "Jazz:Off"
    };
    console.log(jazzMode);
});


startStopButton.addEventListener("click", function () {

    if (playingMetronome == false) {
        startMetronome();
    }
    else if (playingMetronome == true) {
        stopMetronome();
    }
});

function updateNumOfBeats() {
    numOfBeats.innerText = beatsPerBarInput.value;
    count = 1;
}

function updateBPM() {
    if (playingMetronome == false) {
        const bpm = document.getElementById("bpmInput").value;
        document.getElementById("currentBPM").innerText = bpm;
    } else if (playingMetronome == true) {
        stopMetronome();
        setTimeout(function () {
            const bpm = document.getElementById("bpmInput").value;
            document.getElementById("currentBPM").innerText = bpm;
            startMetronome();
        }, 500);
    }
    updateNumOfBeats()
}

function startMetronome() {
    document.getElementById("startStopButton").innerText = "Stop";
    document.getElementById("startStopButton").style.background = "black";
    playingMetronome = true;
    const bpm = parseInt(bpmInput.value);
    const interval = (60 / bpm) * 1000;
    const gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);
    gainNode.gain.setValueAtTime(1, audioContext.currentTime);

    const now = audioContext.currentTime;
    let nextStartTime = now
    const countArr = ["ZERO", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE"];
    var circleColor = "ligthgray";

    // metronome oscillator
    oscillator = audioContext.createOscillator();
    if (count == 1 && jazzMode == false) { oscillator.frequency.value = 440; circleColor = "lightgray"; }
    else if (count % 2 == 0 && jazzMode == true) { oscillator.frequency.value = 330; circleColor = "white"; }
    else if (count % 2 !== 0 && jazzMode == true) { oscillator.frequency.value = 0; circleColor = "white"; }
    else { oscillator.frequency.value = 330; circleColor = "white"; };
    console.log(count, oscillator.frequency.value);
    oscillator.type = "triangle";
    oscillator.connect(gainNode);
    oscillator.start(nextStartTime);
    gainNode.gain.setValueAtTime(1, nextStartTime);
    gainNode.gain.linearRampToValueAtTime(0, nextStartTime + 0.1);
    oscillator.stop(nextStartTime + 0.2);
    circle.innerHTML = `<div class="halo">${countArr[count]}</div>`; // Add the pulsating halo to the circle
    circle.style.background = circleColor;
    count++;
    if (count > beatsPerBarInput.value) { count = 1 }
    intervalId = setInterval(function () {
        nextStartTime += interval / 1000;
        oscillator = audioContext.createOscillator();
        if (count == 1 && jazzMode == false) { oscillator.frequency.value = 440; circleColor = "lightgray"; }
        else if (count % 2 == 0 && jazzMode == true) { oscillator.frequency.value = 330; circleColor = "white"; }
        else if (count % 2 !== 0 && jazzMode == true) { oscillator.frequency.value = 0; circleColor = "white"; }
        else { oscillator.frequency.value = 330; circleColor = "white"; };
        console.log(count, oscillator.frequency.value);
        oscillator.type = "triangle";
        oscillator.connect(gainNode);
        oscillator.start(nextStartTime);
        gainNode.gain.setValueAtTime(1, nextStartTime);
        gainNode.gain.linearRampToValueAtTime(0, nextStartTime + 0.1);
        oscillator.stop(nextStartTime + 0.2);
        circle.innerHTML = `<div class="halo">${countArr[count]}</div>`; // Add the pulsating halo to the circle
        circle.style.background = circleColor;
        count++;
        if (count > beatsPerBarInput.value) { count = 1 }

    }, interval);
}

function stopMetronome() {
    oscillator.stop();
    clearInterval(intervalId);
    playingMetronome = false;
    document.getElementById("startStopButton").innerText = "Start";
    document.getElementById("startStopButton").style.background = "red";

}

// double cick to reset
bpmInput.addEventListener('dblclick', function () {
    bpmInput.value = 130;
    updateBPM();
});


