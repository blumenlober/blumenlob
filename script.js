/* ==========================================================
   Blüten des Lobes
   script.js
   Teil 1 von 3
   ========================================================== */

const flowerA = document.getElementById("flowerA");
const flowerB = document.getElementById("flowerB");

const nextButton = document.getElementById("nextButton");
const galleryButton = document.getElementById("galleryButton");

const gallery = document.getElementById("gallery");
const galleryGrid = document.getElementById("galleryGrid");
const closeGallery = document.getElementById("closeGallery");

let activeFlower = flowerA;
let hiddenFlower = flowerB;

let flowers = [];
let remainingFlowers = [];
let currentFlower = null;

/* ==========================================================
   Initialisierung
   ========================================================== */

window.addEventListener("DOMContentLoaded", init);

async function init() {

    try {

        const response = await fetch(CONFIG.json + "?v=" + Date.now(), {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error(
                "blueten.json konnte nicht geladen werden."
            );
        }

        flowers = await response.json();

        if (!Array.isArray(flowers) || flowers.length === 0) {
            throw new Error(
                "blueten.json enthält keine gültigen Daten."
            );
        }

        loadRemainingFlowers();

        buildGallery();

        nextButton.addEventListener("click", () => {
            showRandomFlower();
        });

        galleryButton.addEventListener("click", openGallery);

        closeGallery.addEventListener("click", closeGalleryWindow);

        gallery.addEventListener("click", (event) => {

            if (event.target === gallery) {
                closeGalleryWindow();
            }

        });

        document.addEventListener("keydown", handleKeyDown);

        await showRandomFlower(false);

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

}

/* ==========================================================
   Speicherung
   ========================================================== */

function loadRemainingFlowers() {

    const saved = localStorage.getItem(CONFIG.storageKey);

    if (!saved) {

        refillRemainingFlowers();
        return;

    }

    try {

        remainingFlowers = JSON.parse(saved);

        if (!Array.isArray(remainingFlowers)) {
            throw new Error();
        }

    } catch {

        refillRemainingFlowers();

    }

}

function saveRemainingFlowers() {

    localStorage.setItem(
        CONFIG.storageKey,
        JSON.stringify(remainingFlowers)
    );

}

function refillRemainingFlowers() {

    remainingFlowers = [...flowers];

    shuffleArray(remainingFlowers);

    saveRemainingFlowers();

}

/* ==========================================================
   Zufall
   ========================================================== */

function shuffleArray(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [
            array[j],
            array[i]
        ];

    }

}

/* ==========================================================
   Bild laden
   ========================================================== */

function preloadImage(src) {

    return new Promise((resolve, reject) => {

        const img = new Image();

        img.onload = () => resolve(src);

        img.onerror = () =>
            reject(
                new Error(
                    "Bild konnte nicht geladen werden:\n" + src
                )
            );

        img.src = src;

    });

}
