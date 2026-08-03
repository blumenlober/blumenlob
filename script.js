window.addEventListener("DOMContentLoaded", async () => {

    const flower = document.getElementById("flower");
    const nextButton = document.getElementById("nextButton");

    const STORAGE_KEY = "blueten-privat";

    let images = [];

    async function loadFlower() {

        if (images.length === 0) {

            const response = await fetch("blueten.json");
            images = await response.json();

        }

        let state = JSON.parse(localStorage.getItem(STORAGE_KEY));

        if (!state || state.remaining.length === 0) {

            const shuffled = [...images];

            shuffle(shuffled);

            state = { remaining: shuffled };

        }

        const next = state.remaining.pop();

        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

        flower.style.opacity = 0;

        setTimeout(() => {

            flower.src = "blueten/" + next;

            flower.onload = () => {

                flower.style.opacity = 1;

            };

        }, 150);

    }

    function shuffle(array) {

        for (let i = array.length - 1; i > 0; i--) {

            const j = Math.floor(Math.random() * (i + 1));

            [array[i], array[j]] = [array[j], array[i]];

        }

    }

    nextButton.addEventListener("click", loadFlower);

    await loadFlower();

});
