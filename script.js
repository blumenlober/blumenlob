const flower = document.getElementById("flower");

fetch("blueten.json")
    .then(response => response.json())
    .then(images => {

        const randomIndex = Math.floor(Math.random() * images.length);

        flower.src = "blueten/" + images[randomIndex];

    })
    .catch(error => {

        console.error("Fehler beim Laden der Blüten:", error);

    });