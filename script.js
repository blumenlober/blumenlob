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

        flowers = flowers.map((image) => {

            return {
                image: CONFIG.imageFolder + image,
                name: "",
                text: ""
            };

        });

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

/* ==========================================================
   Blütenwechsel
   ========================================================== */

async function showRandomFlower(removeOld = true) {

    if (remainingFlowers.length === 0) {

        refillRemainingFlowers();

    }


    const index = Math.floor(
        Math.random() * remainingFlowers.length
    );


    currentFlower = remainingFlowers[index];


    remainingFlowers.splice(index, 1);


    saveRemainingFlowers();


    try {

        await preloadImage(
            currentFlower.image
        );


        displayFlower(
            currentFlower
        );


    } catch (error) {

        console.error(error);

        alert(error.message);

    }

}


/* ==========================================================
   Blume anzeigen
   ========================================================== */

function displayFlower(flower) {


    hiddenFlower.src = flower.image;


    hiddenFlower.alt =
        flower.name || "Blüte des Lobes";


    hiddenFlower.classList.add(
    "visible"
);


activeFlower.classList.remove(
    "visible"
);

    setTimeout(() => {


        const temp = activeFlower;


        activeFlower = hiddenFlower;


        hiddenFlower = temp;


        hiddenFlower.src = "";


    }, 600);



    updateText(
        flower
    );

}


/* ==========================================================
   Text aktualisieren
   ========================================================== */

function updateText(flower) {


    const title =
        document.getElementById(
            "flowerTitle"
        );


    const text =
        document.getElementById(
            "flowerText"
        );


    if (title) {

        title.textContent =
            flower.name || "";

    }


    if (text) {

        text.textContent =
            flower.text || "";

    }

}


/* ==========================================================
   Tastatursteuerung
   ========================================================== */

function handleKeyDown(event) {


    if (
        event.key === "Escape" &&
        gallery.classList.contains("open")
    ) {

        closeGalleryWindow();

        return;

    }


    if (
        event.key === "ArrowRight" ||
        event.key === " "
    ) {

        showRandomFlower();

    }


    if (
        event.key === "g" ||
        event.key === "G"
    ) {

        openGallery();

    }

}

/* ==========================================================
   Galerie
   ========================================================== */

function buildGallery() {

    galleryGrid.innerHTML = "";


    flowers.forEach((flower) => {


        const item = document.createElement(
            "div"
        );


        item.className =
            "galleryItem";


        const img = document.createElement(
            "img"
        );


        img.className =
            "galleryImage";


        img.src =
            flower.image;


        img.alt =
            flower.name || "Blüte";


        img.loading =
            "lazy";


        const title =
            document.createElement(
                "div"
            );


        title.className =
            "galleryTitle";


        title.textContent =
            flower.name || "";


        item.appendChild(img);

        item.appendChild(title);



        item.addEventListener(
            "click",
            () => {


                currentFlower =
                    flower;


                displayFlower(
                    flower
                );


                closeGalleryWindow();


            }
        );


        galleryGrid.appendChild(
            item
        );


    });

}


/* ==========================================================
   Galerie öffnen
   ========================================================== */

function openGallery() {

    gallery.classList.remove(
        "hidden"
    );

    gallery.classList.add(
        "open"
    );

    gallery.setAttribute(
        "aria-hidden",
        "false"
    );

}


/* ==========================================================
   Galerie schließen
   ========================================================== */

function closeGalleryWindow() {

    gallery.classList.remove(
        "open"
    );

    gallery.classList.add(
        "hidden"
    );

    gallery.setAttribute(
        "aria-hidden",
        "true"
    );

}


/* ==========================================================
   Sicherheitsfunktionen
   ========================================================== */

window.addEventListener(
    "error",
    (event) => {

        console.error(
            "JavaScript Fehler:",
            event.error
        );

    }
);


/* ==========================================================
   Ende script.js
   ========================================================== */