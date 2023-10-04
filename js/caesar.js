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
    document.getElementById("original-text").addEventListener("input", generateCipher);
    document.getElementById("caesar-slider").addEventListener("change", generateCipher);
}

function generateCipher() {
    const originalText = document.getElementById("original-text").value;
    const cipheredText = document.getElementById("ciphered-text");
    const offset = parseInt(document.getElementById("caesar-input").value, 10);
    cipheredText.innerText = calculateCipher(originalText, offset);
    populatePossibilities();
}

function calculateCipher(originalText, offset) {

    const textLength = originalText.length;
    let convertedText = "";

    for (let i = 0; i < textLength; i++) {
        const selectedCharacter = originalText[i];

        // Check if space, number, or symbol
        if (selectedCharacter === " " || !isAlpha(selectedCharacter)) {
            convertedText += selectedCharacter;
            continue;
        }

        let convertedCharacter = originalText.charCodeAt(i)

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
        convertedText += String.fromCodePoint(convertedCharacter);
    }
    return convertedText;
}

function populatePossibilities() {

    const originalText = document.getElementById("original-text").value;
    const possibilityElement = document.getElementById("possibilities");
    possibilityElement.innerHTML = "<tr><th>Offset</th><th>Message</th></tr>";

    for (let i = -25; i < 26; i++) {
        const possibilityEntry = document.createElement("tr");
        const possibilityOffset = document.createElement("td");
        const possibilityText = document.createElement("td");

        possibilityOffset.textContent = i;
        possibilityText.textContent = calculateCipher(originalText, i);

        possibilityEntry.appendChild(possibilityOffset);
        possibilityEntry.appendChild(possibilityText);
        possibilityElement.appendChild(possibilityEntry);
    }
}

function isAlpha(char) {
    const letterPattern = /^[A-Za-z]$/;
    return letterPattern.test(char);
}

setupSliderAndInput();
setupGenerateMethods()