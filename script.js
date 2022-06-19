var wordContainer;
var playedLetterList = [];
var playedLetter;
var lifes = 7;
var hitLettersCounts = 0;
var secretWord;
var leftLifes;
var btnRestart;
var hitLetters;
var btnInputLetter;

window.onload = async ()=>{
    wordContainer = document.getElementById("word-container");
    playedLetter = document.getElementById("letter");
    leftLifes = document.getElementById("left-lifes");
    btnRestart = document.getElementById("restart");
    hitLetters = document.getElementById("letters-hit");
    btnInputLetter = document.getElementById("btn-input-letter");

    await getSecretWord().then(data => {
        secretWord = data;
        leftLifes.innerHTML = "Vidas: " + lifes;
    
        btnRestart.addEventListener("click", ()=> {
            restartGame();
        });

        btnInputLetter.addEventListener("click", ()=> {
            addLetter();
        });
    
        playedLetter.addEventListener('keyup', function(e) {
    
            const keycode = e.keyCode || e.which;
    
            if (keycode == 13) {
                addLetter();
            }
        });
    
        generateHiddenWords();
    });
}

function addLetter() {
    if (playedLetter.value) {
        if (playedLetterList.includes((playedLetter.value).toUpperCase())) {
            alert("La letra ya está ingresada");
            playedLetter.value = "";
        } else {
            playedLetterList.push((playedLetter.value).toUpperCase());
            validateLetter((playedLetter.value).toUpperCase());
            playedLetter.value = "";
        }
    }
}

function updateHitLetters() {

    hitLetters.innerHTML = "Letras incorrectas: ";

    for (let i = 0 ; i < playedLetterList.length ; i++) {
        if (!secretWord.includes(playedLetterList[i])) {
            hitLetters.innerHTML += " " + playedLetterList[i];
        }
    }
    
}

function validateLetter(letter) {

    count = 0;
    position = secretWord.indexOf(letter);

    while ( position != -1 ) {
        count++;
        position = secretWord.indexOf(letter, position + 1);
    }

    if (count > 0) {
        hitLettersCounts += count;
        checkWin();
    } else {
        updateHitLetters();
        lifes --;
        leftLifes.innerHTML = "Vidas: " + lifes;
        
        updatePlayer();

        if (lifes < 1) {
            alert("Perdiste. La palabra era " + secretWord);

            let inputLetter = document.getElementById("letter");
            inputLetter.disabled = true;
        }
    }
}

async function restartGame() {

    let head = document.getElementById("player-head");
    let body = document.getElementById("player-body");
    let leftArm = document.getElementById("player-left-arm");
    let rightArm = document.getElementById("player-right-arm");
    let leftLeg = document.getElementById("player-left-leg");
    let rightLeg = document.getElementById("player-right-leg");
    let inputLetter = document.getElementById("letter");

    inputLetter.disabled = false;
    playedLetterList = [];
    hitLettersCounts = 0;
    hitLetters.innerHTML = "";
    lifes = 7;

    head.style.display = "none";
    body.style.display = "none";
    leftArm.style.display = "none";
    rightArm.style.display = "none";
    leftLeg.style.display = "none";
    rightLeg.style.display = "none";
    head.style.borderColor = "black";
    body.style.borderColor = "black";
    leftArm.style.borderColor = "black";
    rightArm.style.borderColor = "black";
    leftLeg.style.borderColor = "black";
    rightLeg.style.borderColor = "black";
    
    leftLifes.innerHTML = "Vidas: " + lifes;

    await getSecretWord().then(data => {
        secretWord = data;
        generateHiddenWords();
    });
}

function checkWin() {
    const wordLength = secretWord.length;
    
    generateHiddenWords();

    if (wordLength <= hitLettersCounts) {
        alert("Ganaste");
        
        let inputLetter = document.getElementById("letter");
        inputLetter.disabled = true;
    }    
    
}

function updatePlayer() {

    let head = document.getElementById("player-head");
    let body = document.getElementById("player-body");
    let leftArm = document.getElementById("player-left-arm");
    let rightArm = document.getElementById("player-right-arm");
    let leftLeg = document.getElementById("player-left-leg");
    let rightLeg = document.getElementById("player-right-leg");

    switch(lifes) {
        case 6:
        head.style.display = "inline";
        break;
        case 5:
        body.style.display = "inline";
        break;
        case 4:
        leftArm.style.display = "inline";
        break;
        case 3:
        rightArm.style.display = "inline";
        break;
        case 2:
        leftLeg.style.display = "inline";
        break;
        case 1:
        rightLeg.style.display = "inline";
        break;
        case 0:
        head.style.borderColor = "red";
        body.style.borderColor = "red";
        leftArm.style.borderColor = "red";
        rightArm.style.borderColor = "red";
        leftLeg.style.borderColor = "red";
        rightLeg.style.borderColor = "red";
        break;
    }
}

function generateHiddenWords() {
    const wordLength = secretWord.length;

    wordContainer.innerHTML = "";

    for (let i = 0 ; i < wordLength ; i++) {
        let newLetter = document.createElement("span");
        newLetter.classList += "letter";

        const showLetter = playedLetterList.includes(secretWord.charAt(i));

        if (showLetter) {
            newLetter.innerHTML = secretWord.charAt(i);
        }

        wordContainer.appendChild(newLetter);
    }
}

async function getSecretWord() {
    let randomWord;

    const randomLength = Math.floor(Math.random() * (10 - 4) + 4);

    await fetch("https://clientes.api.greenborn.com.ar/public-random-word?c=1&l=" + randomLength, {
        method: 'GET'
    })
    .then(resp => resp.json())
    .then(data => {
        randomWord = data.toString();
    });

    const response = randomWord.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    if (response)
        return response.toUpperCase();

    // let wordList = ["BICICLETA", "TELEVISOR", "COMPUTADORA", "TRABAJO", "CELULAR", "TERMO", "PROGRAMACION", "BATERIA", "ESTUFA",  "MEDIALUNA", "PAPEL", "ELEFANTE"];
    
    // const randomNumber = Math.floor(Math.random() * ((wordList.length) - 0) + 0);

    // return wordList[randomNumber];
}