function main() {
    setupSliderAndInput();
    setupGenerateButton().then();
    setupCopyButton();
}

// fetches a word list from GitHub and then proceeds to process it
async function fetchWordList() {
    const wordsUrl = "https://gist.githubusercontent.com/Igloo-Ctrl/c7b42e883b92da19c1309b4dff42035f/raw/31f7569a57d58397002c6199de49b5e9177256db/words.txt";

    try {
        const response = await fetch(wordsUrl);
        const data = await response.text();
        return data.split('\n');
    } catch (error) {
        console.error("Uh oh, error: ", error);
        return [];
    }
}

// processes the passed in word list and sorts it into a dictionary, where the key is the length of the word
function createWordDictionary(wordList) {
    const wordDict = {};

    wordList.forEach(word => {
        const wordLength = word.length;
        if (wordLength in wordDict) {
            wordDict[wordLength].push(word);
        } else {
            wordDict[wordLength] = [word];
        }
    });

    return wordDict;
}

function setupSliderAndInput() {
    const DEFAULT_SLIDER_VALUE = 5;
    const SLIDER_MIN = 1;
    const SLIDER_MAX = 21;

    const numberOfWordsInput = document.getElementById("number-of-words-input");
    const numberOfWordsSlider = document.getElementById("number-of-words-slider");
    const wordLengthInput = document.getElementById("word-length-input");
    const wordLengthSlider = document.getElementById("word-length-slider");

    // set initial values and slider range
    numberOfWordsSlider.value = DEFAULT_SLIDER_VALUE;
    numberOfWordsInput.value = numberOfWordsSlider.value;

    wordLengthSlider.value = DEFAULT_SLIDER_VALUE;
    wordLengthInput.value = wordLengthSlider.value;

    numberOfWordsSlider.min = SLIDER_MIN;
    numberOfWordsSlider.max = SLIDER_MAX;

    wordLengthSlider.min = SLIDER_MIN;
    wordLengthSlider.max = SLIDER_MAX;

    // add event listeners for updating input values
    wordLengthSlider.addEventListener("input", function () {
        wordLengthInput.value = wordLengthSlider.value;
    });

    numberOfWordsSlider.addEventListener("input", function () {
        numberOfWordsInput.value = numberOfWordsSlider.value;
    });

    // enforce min and max values for both inputs
    const enforceMinMax = function (inputElement, min, max) {
        inputElement.addEventListener("change", function () {
            const inputValue = parseInt(inputElement.value);

            if (Number.isNaN(inputValue)) {
                inputElement.value = min;
            }

            if (inputValue < min) {
                inputElement.value = min;
            } else if (inputValue > max) {
                inputElement.value = max;
            }
        });
    }

    enforceMinMax(numberOfWordsInput, SLIDER_MIN, SLIDER_MAX);
    enforceMinMax(wordLengthInput, SLIDER_MIN, SLIDER_MAX);
}

async function setupGenerateButton() {
    const wordList = await fetchWordList();
    const wordDict = createWordDictionary(wordList);

    generateWordLists(wordDict);

    document.getElementById("generate-button").addEventListener("click", generatePassword)

    function generatePassword() {
        const wordCount = document.getElementById("number-of-words-input").value;
        const wordLength = document.getElementById("word-length-input").value;
        const choice = wordDict[wordLength];
        const result = document.getElementById("result");

        document.getElementById("error-message").textContent = String.fromCharCode(160);

        let password = "";
        for (let i = 0; i < wordCount; i++) {
            const chosenWord = wordDict[wordLength][Math.floor(Math.random() * choice.length)];
            password += `${chosenWord} `;
        }

        // remove the trailing space
        result.value = password.trim();
    }

    generatePassword();
}

function generateWordLists(wordDict) {
    const detailsElement = document.getElementById("words");
    const lengthList = [
        "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
        "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty",
        "Twenty-One", "Twenty-Two", "Twenty-Three", "Twenty-Four", "Twenty-Five", "Twenty-Six", "Twenty-Seven", "Twenty-Eight", "Twenty-Nine", "Thirty", "Thirty-One"
    ];

    const lengthListLength = lengthList.length
    for (let i = 0; i < lengthListLength; i++) {
        const newDetails = document.createElement("details");
        const newSummary = document.createElement("summary");
        const listParagraph = document.createElement("p");
        newDetails.appendChild(newSummary);
        newDetails.append(listParagraph);
        detailsElement.appendChild(newDetails);

        // check if dictionary key exists
        if (wordDict[i + 1]) {
            newSummary.textContent = `${lengthList[i]} letter words (${wordDict[i + 1].length})`;
            listParagraph.innerHTML = `<samp>${wordDict[i + 1].join(" ")}</samp>`;
        } else {
            newSummary.textContent = `${lengthList[i]} letter words (0)`
            listParagraph.textContent = "No words found.";
        }
    }
}

function setupCopyButton() {
    document.getElementById("copy-button").addEventListener("click", function () {
        const result = document.getElementById("result");
        if (result.value === "") {
            document.getElementById("error-message").innerText = "Nothing to copy."
        } else {
            result.select();
            result.setSelectionRange(0, 99999);
            navigator.clipboard.writeText(result.value).then(() => {
            });
            result.blur();
            document.getElementById("error-message").innerText = "Password copied to clipboard!";
        }
    })
}

main();
