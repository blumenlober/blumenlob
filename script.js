const flowerA = document.getElementById("flowerA");
const flowerB = document.getElementById("flowerB");

const nextButton = document.getElementById("nextButton");
const galleryButton = document.getElementById("galleryButton");

const gallery = document.getElementById("gallery");
const galleryGrid = document.getElementById("galleryGrid");
const closeGallery = document.getElementById("closeGallery");

const STORAGE_KEY = CONFIG.storageKey;

let images = [];
let remaining = [];

let activeFlower = flowerA;
let hiddenFlower = flowerB;

async function init() {

    

    alert("Init gestartet");

    const response = await fetch(CONFIG.json);

    alert("JSON geladen");

    images = await response.json();

    alert("JSON eingelesen");

    loadState();

    alert("State geladen");

    await showNextFlower(false);

    alert("Erstes Bild geladen");

    ...
}

    const response = await fetch(CONFIG.json);
    images = await response.json();

    loadState();

    await showNextFlower(false);

    buildGallery();

    nextButton.addEventListener("click", () => {
        showNextFlower(true);
    });

    galleryButton.addEventListener("click", () => {

    alert("Galerie-Button funktioniert");

});

    closeGallery.addEventListener("click", () => {
        gallery.classList.add("hidden");
    });

    gallery.addEventListener("click", (e) => {
        if (e.target === gallery) {
            gallery.classList.add("hidden");
        }
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

    await loadImage(hiddenFlower, CONFIG.imageFolder + file);

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

function buildGallery() {

    galleryGrid.innerHTML = "";

    images.forEach(file => {

        const img = document.createElement("img");

        img.src = CONFIG.imageFolder + file;
        img.className = "galleryImage";
        img.alt = "";

        galleryGrid.appendChild(img);

    });

}

init();
