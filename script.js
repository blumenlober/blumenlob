const flower = document.getElementById("flower");
const nextButton = document.getElementById("nextButton");

const STORAGE_KEY = CONFIG.storageKey;

let images = [];
let remaining = [];

async function init() {

    const response = await fetch(CONFIG.json);
    images = await response.json();

    loadState();

    showNextFlower();
}

function loadState() {

    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {

        remaining = JSON.parse(saved);

    } else {

        refillRemaining();

    }
}

function refillRemaining() {

    remaining = [...images];

    shuffle(remaining);
}

function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];
    }
}

function showNextFlower() {

    if (remaining.length === 0) {

        refillRemaining();

    }

    const file = remaining.pop();

    localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));

    flower.src = CONFIG.imageFolder + file;
}

nextButton.addEventListener("click", showNextFlower);

init();
