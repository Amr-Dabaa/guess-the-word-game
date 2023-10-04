const message = document.querySelector(".message");
const wordInProgress = document.querySelector(".word-in-progress");
const remainingGuesses = document.querySelector(".remaining span");
const guessedLettersList = document.querySelector(".guessed-letters");
const guessButton = document.querySelector(".guess");
const letterInput = document.querySelector("#letter");
const playAgainButton = document.querySelector(".play-again");

let word = "";
let wordWithLettersFound = "";
let numberOfGuessesRemaining = 8;



const getRandomWord = async function () {


    let request = await fetch("https://gist.githubusercontent.com/skillcrush-curriculum/7061f1d4d3d5bfe47efbfbcfe42bf57e/raw/5ffc447694486e7dea686f34a6c085ae371b43fe/words.txt");
    let result = await request.text();
    const wordArray = result.split("\n")
    let randomIndex = Math.floor(Math.random() * wordArray.length);
    word = wordArray[randomIndex];
    word = word.toUpperCase().trim();
    //Display circles corresponding to word letters
    for (let i = 0; i < word.length; i++) {
        wordWithLettersFound = wordWithLettersFound + "●";
    }
    displayWordInProgress();
    console.log(word);

}

const replaceCircleWithCharacter = function (myString, character, index) {

    let myArray = myString.split("");
    myArray.splice(index, 1, character);
    return myArray.join("");
}


const displayWordInProgress = function () {

    wordInProgress.innerText = wordWithLettersFound;

}

const addLetterToGuessedLettersList = function (letterEntered) {

    let li = document.createElement("li");
    li.innerText = letterEntered;
    guessedLettersList.append(li);
    console.log(guessedLettersList);
}

const adjusSettingsForNotFoundLetter = function () {

    numberOfGuessesRemaining -= 1;
    remainingGuesses.innerText = `${numberOfGuessesRemaining} guesses`;

    if (numberOfGuessesRemaining == 0) {
        endGame();
    }

}

const wordCompletelyGuessed = function (wordWithLettersFound) {
    if (!wordWithLettersFound.includes("●"))
        return true;
    else
        return false;

}

const endGame = function () {
    guessButton.classList.add('hide');
    playAgainButton.classList.remove('hide');
}

const startOver = function () {
    playAgainButton.classList.add("hide");
    wordWithLettersFound = "";
    wordInProgress.innerText = "";
    numberOfGuessesRemaining = 8;
    remainingGuesses.innerText = `${numberOfGuessesRemaining} guesses`;
    message.innerText = "";
    message.classList.remove("win");
    guessButton.classList.remove("hide");
    guessedLettersList.innerHTML = "";
    getRandomWord();
    displayWordInProgress();
}

const showCongratulationMessage = function () {
    message.innerText = "You guessed correct the word! Congrats!";
    message.classList.add("win");
}

const checkIfLetterIsInWord = function (letterEntered) {

    let letterFound = false;

    if (word.includes(letterEntered)) {
        for (let i = 0; i < word.length; i++) {
            if (word[i] === letterEntered) {
                if (wordWithLettersFound[i] == "●") {
                    wordWithLettersFound = replaceCircleWithCharacter(wordWithLettersFound, letterEntered, i);
                    message.innerText = 'Good guess, the word has the letter ' + letterEntered;
                    if (wordCompletelyGuessed(wordWithLettersFound)) {
                        endGame();
                        showCongratulationMessage();
                        return;
                    }
                    letterFound = true;
                }
            }
        }
        if (!letterFound) {
            adjusSettingsForNotFoundLetter();
        }

    } else {
        adjusSettingsForNotFoundLetter();
    }

}

const letterAlreadyUsed = function (letterEntered) {

    var items = guessedLettersList.getElementsByTagName("li");
    for (var i = 0; i < items.length; ++i) {
        if (items[i].innerText == letterEntered)
            return true;
    }
    return false;
}

const checkLetter = function (letterEntered) {

    const acceptedLetter = /[a-zA-Z]/;
    let alertMessage = "";

    if (letterEntered == "") {
        alertMessage = 'Please enter a letter';
    } else if (letterEntered.length > 1) {
        alertMessage = 'Please enter only one letter';
    } else if (!letterEntered.match(acceptedLetter)) {
        alertMessage = 'You can only enter characters. No numbers allowed';
    } else if (letterAlreadyUsed(letterEntered)) {
        alertMessage = 'Character previously used. GUESS SAVED :)';
    }
    else {
        return true;
    }

    message.innerText = alertMessage;
    return false;

}


guessButton.addEventListener("click", function (e) {

    e.preventDefault();

    message.innerText = "";
    let letterEntered = letterInput.value.toUpperCase();
    let letterAccepted = checkLetter(letterEntered);
    if (letterAccepted) {
        addLetterToGuessedLettersList(letterEntered);
        checkIfLetterIsInWord(letterEntered);
        displayWordInProgress();
        letterInput.value = "";
    }


});

playAgainButton.addEventListener("click", function () {
    startOver();
})

getRandomWord();
displayWordInProgress();


