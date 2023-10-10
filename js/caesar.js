function setupSliderAndInput() {
    const shiftInput = document.getElementById("caesar-input");
    const shiftSlider = document.getElementById("caesar-slider");

    const MIN_SHIFT_VALUE = -25;
    const MAX_SHIFT_VALUE = 25;
    const DEFAULT_SLIDER_VALUE = 0;

    // slider values
    shiftSlider.min = MIN_SHIFT_VALUE;
    shiftSlider.max = MAX_SHIFT_VALUE;
    shiftSlider.value = DEFAULT_SLIDER_VALUE;
    shiftInput.value = shiftSlider.value;

    // update input when slider changes
    shiftSlider.addEventListener("input", function () {
        shiftInput.value = shiftSlider.value;
    });

    // enforce min and max
    shiftInput.addEventListener("change", function () {
        const lengthInputValue = parseInt(shiftInput.value);

        // check for non-number inputs, not robust enough #TO-DO
        if (Number.isNaN(lengthInputValue)) {
            shiftInput.value = MIN_SHIFT_VALUE;
        }

        if (lengthInputValue < MIN_SHIFT_VALUE) {
            shiftInput.value = MIN_SHIFT_VALUE;
        } else if (lengthInputValue > MAX_SHIFT_VALUE) {
            shiftInput.value = MAX_SHIFT_VALUE;
        }
    });
}

function setupGenerateMethods() {
    // a strange way of wrapping the listeners to ensure the set promise is fulfilled and can be passed into the functions
    createWordSet().then(wordSet => {
        document.getElementById("original-text").addEventListener("input", function () {
            generateCipher(wordSet)
        });
        document.getElementById("caesar-slider").addEventListener("change", function () {
            generateCipher(wordSet)
        });
    });
}

function generateCipher(wordSet) {
    const originalText = document.getElementById("original-text").value;
    const cipheredText = document.getElementById("ciphered-text");
    const offset = parseInt(document.getElementById("caesar-input").value, 10);

    cipheredText.value = calculateCipher(originalText, offset);

    const possibilities = populatePossibilities();
    determineLikelyMessage(wordSet, possibilities);
}

function calculateCipher(originalText, offset) {

    const textLength = originalText.length;
    let convertedText = "";

    for (let i = 0; i < textLength; i++) {
        const selectedCharacter = originalText[i];

        // check if space, number, or symbol
        if (selectedCharacter === " " || !isAlpha(selectedCharacter)) {
            convertedText += selectedCharacter;
            continue;
        }

        let convertedCharacter = originalText.charCodeAt(i)

        // if a character has gotten to this point, it must be a letter
        // checks if it is a lowercase or uppercase and then deals with the potential wraparound
        if (convertedCharacter >= 97 && convertedCharacter <= 122) {
            convertedCharacter += offset
            if (convertedCharacter < 97) {
                convertedCharacter += 26;
            } else if (convertedCharacter > 122) {
                convertedCharacter -= 26;
            }
        } else {
            convertedCharacter += offset
            if (convertedCharacter < 65) {
                convertedCharacter += 26;
            } else if (convertedCharacter > 90) {
                convertedCharacter -= 26;
            }
        }
        // converts characters back from ascii
        convertedText += String.fromCodePoint(convertedCharacter);
    }
    return convertedText;
}

function populatePossibilities() {
    // generate each possibility of cipher, populating the possibilities element and returning for further use

    const originalText = document.getElementById("original-text").value;
    const possibilityElement = document.getElementById("possibilities");
    possibilityElement.innerHTML = "<tr><th>Offset</th><th>Message</th></tr>";

    const possibilities = [];

    // populate the possibilities details element
    for (let i = -25; i < 26; i++) {
        const possibilityEntry = document.createElement("tr");
        const possibilityOffset = document.createElement("td");
        const possibilityText = document.createElement("td");

        possibilityOffset.textContent = `${i}`;

        const generatedCipher = calculateCipher(originalText, i)
        possibilities.push(generatedCipher);
        possibilityText.textContent = generatedCipher;

        possibilityEntry.appendChild(possibilityOffset);
        possibilityEntry.appendChild(possibilityText);
        possibilityElement.appendChild(possibilityEntry);
    }
    return possibilities;
}

function isAlpha(char) {
    // checks if a character is alpha using regex
    const letterPattern = /^[A-Za-z]$/;
    return letterPattern.test(char);
}

function determineLikelyMessage(wordSet, possibilities) {

    let count = possibilities[0].split(" ").length;
    let possibilityDict = {};

    // check each possibility and calculate how many of its words are English
    for (const possibility of possibilities) {
        possibilityDict[possibility] = 0;
        const wordsArray = possibility.split(" ");
        for (const word of wordsArray) {
            const lowerCaseWord = word.toLowerCase();
            if (wordSet.has(lowerCaseWord)) {
                possibilityDict[possibility] += 1;
            }
        }
    }

    // find the possibility with the highest occurrence of English words
    let likelyMessage;
    outerLoop: for (let i = count; i > 0; i--) {
        for (const key in possibilityDict) {
            if (possibilityDict[key] === i) {
                likelyMessage = key;
                break outerLoop;
            }
        }
    }

    // display a message depending on if text is present, if a likelyMessage exists or anything else
    const guessParagraph = document.getElementById("guess-paragraph");
    if (document.getElementById("original-text").value === "") {
        guessParagraph.innerText = "My prediction will go here once you enter some text."
    } else if (likelyMessage) {
        document.getElementById("guess-paragraph").innerText =
            `If I had to guess, the original message was "${likelyMessage}".`
    } else {
        document.getElementById("guess-paragraph").innerText =
            "Your original message wasn't English, was a series of numbers or intelligible text."
    }

}


async function fetchWordList() {
    // fetches the list of words from the url and returns them as an array
    const oldWordsUrl = "https://gist.githubusercontent.com/Igloo-Ctrl/c7b42e883b92da19c1309b4dff42035f/raw/31f7569a57d58397002c6199de49b5e9177256db/words.txt";
    const wordsUrl = "https://gist.githubusercontent.com/Igloo-Ctrl/41a0c40004c640b57183c480596ed1f0/raw/09bca8fb9d840134a8af3315e99a66f86d2849a1/gistfile1.txt"
    try {
        const response = await fetch(wordsUrl);
        const data = await response.text();
        return data.split('\n');
    } catch (error) {
        console.error("Uh oh, error: ", error);
        return [];
    }
}

async function createWordSet() {
    // creates a word set for use in decoding ciphers
    const wordList = await fetchWordList();
    const wordSet = new Set();
    wordList.forEach(item => {
        wordSet.add(item);
    })
    return wordSet;
}

setupSliderAndInput();
setupGenerateMethods()
