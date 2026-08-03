const flower = document.getElementById("flower");

const STORAGE_KEY = "blueten-privat";

async function start() {

    const response = await fetch("blueten.json");
    const images = await response.json();

    let state = JSON.parse(localStorage.getItem(STORAGE_KEY));

    // Beim ersten Start oder wenn alle Blüten gezeigt wurden
    if (!state || state.remaining.length === 0) {

        const shuffled = [...images];

        shuffle(shuffled);

        state = {
            remaining: shuffled
        };
    }

    const nextFlower = state.remaining.pop();

    flower.src = "blueten/" + nextFlower;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];
    }
}

start();