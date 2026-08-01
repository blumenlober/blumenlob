// ================================
// Globale Variablen
// ================================

let flowers = [];
let order = [];
let currentIndex = 0;

const flowerImage = document.getElementById("flower");
const nextButton = document.getElementById("nextButton");
const galleryButton = document.getElementById("galleryButton");
const gallery = document.getElementById("gallery");
const galleryGrid = document.getElementById("galleryGrid");
const closeGallery = document.getElementById("closeGallery");


// ================================
// Start
// ================================

window.addEventListener("load", init);


// ================================
// Initialisierung
// ================================

async function init() {

    const response = await fetch(CONFIG.jsonFile);

    flowers = await response.json();

    loadProgress();

    showCurrentFlower();

    nextButton.addEventListener("click", nextFlower);

    galleryButton.addEventListener("click", openGallery);

    closeGallery.addEventListener("click", closeGalleryView);

}


// ================================
// Fortschritt laden
// ================================

function loadProgress() {

    const saved = localStorage.getItem(CONFIG.storageKey);

    if (saved) {

        const data = JSON.parse(saved);

        order = data.order;
        currentIndex = data.index;

    }

    if (order.length !== flowers.length) {

        createNewOrder();

    }

}


// ================================
// Neue Reihenfolge erzeugen
// ================================

function createNewOrder() {

    order = [...flowers];

    for (let i = order.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [order[i], order[j]] = [order[j], order[i]];

    }

    currentIndex = 0;

    saveProgress();

}


// ================================
// Fortschritt speichern
// ================================

function saveProgress() {

    localStorage.setItem(

        CONFIG.storageKey,

        JSON.stringify({

            order: order,
            index: currentIndex

        })

    );

}


// ================================
// Aktuelle Blüte anzeigen
// ================================

function showCurrentFlower() {

    flowerImage.classList.remove("show");

    setTimeout(() => {

        flowerImage.src = CONFIG.imageFolder + order[currentIndex];

        flowerImage.onload = () => {

            flowerImage.classList.add("show");

        };

    }, 150);

}


// ================================
// Nächste Blüte
// ================================

function nextFlower() {

    currentIndex++;

    if (currentIndex >= order.length) {

        createNewOrder();

    }

    saveProgress();

    showCurrentFlower();

}
