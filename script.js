const flowerA = document.getElementById("flowerA");
const flowerB = document.getElementById("flowerB");
const nextButton = document.getElementById("nextButton");

const STORAGE_KEY = "blueten-privat";

let images = [];
let remaining = [];
let activeFlower = flowerA;
let hiddenFlower = flowerB;

async function init() {

    const response = await fetch("blueten.json");
    images = await response.json();

    loadState();

    await showNextFlower(false);

    nextButton.addEventListener("click", () => {
        showNextFlower(true);
    });
}

function loadState() {

    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
        refillRemaining();
        return;
    }

    try {

        remaining = JSON.parse(saved);

        if (!Array.isArray(remaining)) {
            throw new Error();
        }

    } catch {

        refillRemaining();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));

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

function loadImage(img, src) {

    return new Promise((resolve) => {

        img.onload = resolve;
        img.src = src;

    });

}

async function showNextFlower(withAnimation = true) {

    if (remaining.length === 0) {
        refillRemaining();
    }

    const file = remaining.pop();

    localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));

    await loadImage(hiddenFlower, "blueten/" + file);

    if (withAnimation) {

        activeFlower.classList.remove("visible");
        hiddenFlower.classList.add("visible");

        [activeFlower, hiddenFlower] = [hiddenFlower, activeFlower];

    } else {

        activeFlower.src = hiddenFlower.src;
        activeFlower.classList.add("visible");
        hiddenFlower.classList.remove("visible");

    }

}

init();