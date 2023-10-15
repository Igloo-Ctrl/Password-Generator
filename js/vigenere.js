function main() {
    setupEncodeButton();
    setupDecodeButton();
    setupCopyButton();
    obscurePassword();
}

function generateCipher(decode) {
    const keyword = document.getElementById("keyword-input").value.toString();
    const originalText = document.getElementById("original-text").value;

    if (checkKeyword(originalText, keyword) !== 1) {
        return;
    }

    // lengthens the keyword if necessary and returns an offset array
    const offsets = keywordIntoOffsets(adjustKeyword(keyword));

    /* the space offset is necessary for when the original text contains a non alpha character
       rather annoyingly, the offset array should not be continued under this circumstance and should
       in essence "pause", which is why the offset decrements down to the previous element
     */
    let spaceOffset = 0;
    let convertedText = "";

    for (let i = 0; i < originalText.length; i++) {

        // skips the character if not alpha and reduces the offset by 1 to correct the index
        if (!originalText[i].match(/^[A-Za-z]+$/)) {
            convertedText += originalText[i];
            spaceOffset--;
            continue;
        }

        let convertedCharacter = originalText.charCodeAt(i)

        // if a character has gotten to this point, it must be a letter
        // checks if it is a lowercase or uppercase and then deals with the potential wraparound

        // depending on if it is encode or decode, you will need to either subtract or plus the offset and I have yet
        // to figure out a more elegant way
        if (decode) {
            if (convertedCharacter >= 97 && convertedCharacter <= 122) {
                convertedCharacter -= offsets[i + spaceOffset]
                convertedCharacter = characterCalculation(97, 122, convertedCharacter);
            } else {
                convertedCharacter -= offsets[i + spaceOffset]
                convertedCharacter = characterCalculation(65, 90, convertedCharacter);
            }
        } else {
            if (convertedCharacter >= 97 && convertedCharacter <= 122) {
                convertedCharacter += offsets[i + spaceOffset]
                convertedCharacter = characterCalculation(97, 122, convertedCharacter);
            } else {
                convertedCharacter += offsets[i + spaceOffset]
                convertedCharacter = characterCalculation(65, 90, convertedCharacter);
            }
        }

        // converts characters back from ascii
        convertedText += String.fromCodePoint(convertedCharacter);
    }

    document.getElementById("ciphered-text").value = convertedText;
    document.getElementById("error-message").textContent = String.fromCharCode(160); // blank character
}

function characterCalculation(lower, upper, character) {
    // deals with the wrap around for lower and uppercase, depending on the passed in values
    if (character < lower) {
        character += 26;
    } else if (character > upper) {
        character -= 26;
    }
    return character;
}

function checkKeyword(originalText, keyword) {
    // checks if the keyword contains only letters, if not, return early
    const errorMessage = document.getElementById("error-message");
    if (originalText.length === 0) {
        errorMessage.innerText = 'Please enter some text to generate or decode a cipher.'
    } else if (keyword.length === 0) {
        errorMessage.innerText = "Please enter a keyword."
    } else if (!keyword.match(/^[A-Za-z]+$/)) {
        errorMessage.innerText = "Please enter a keyword that only contains letters."
    } else {
        return 1;
    }
}

function adjustKeyword(keyword) {
    // adjusts the length of the keyword by repeating it until its length is the same or greater than the original text
    const originalTextLength = document.getElementById("original-text").value.length;

    const loweredKeyword = keyword.toLowerCase();
    let adjustedKeyword = loweredKeyword;
    while (adjustedKeyword.length < originalTextLength) {
        adjustedKeyword += loweredKeyword;
    }
    return adjustedKeyword;
}

function keywordIntoOffsets(keyword) {
    // converts each char into its ascii value and subtracts 97 to get the correct offset
    const keywordArray = keyword.split("");

    let offsetArray = [];
    keywordArray.forEach(letter => {
        const letterToChar = letter.charCodeAt(0);
        offsetArray.push(letterToChar - 97);
    })
    return offsetArray;
}

function setupEncodeButton() {
    document.getElementById("encode-button").addEventListener("click", function () {
        generateCipher(false);
    });
}

function setupDecodeButton() {
    document.getElementById("decode-button").addEventListener("click", function () {
        generateCipher(true)
    })
}

function obscurePassword() {
    const checkbox = document.getElementById("obscure-password-checkbox");
    const keywordInput = document.getElementById("keyword-input")
    checkbox.addEventListener("change", function () {
        if (checkbox.checked) {
            keywordInput.type = "password";
        } else {
            keywordInput.value = "";
            keywordInput.type = "";
        }
    })
}

function setupCopyButton() {
    document.getElementById("copy-output-button").addEventListener("click", function () {
        const result = document.getElementById("ciphered-text");
        if (result.value !== "") {
            result.select();
            result.setSelectionRange(0, 99999);
            navigator.clipboard.writeText(result.value).then(() => {
            });
            result.blur();
            document.getElementById("error-message").innerText = "Password copied to clipboard!";
        } else {
            document.getElementById("error-message").innerText = "Nothing to copy."
        }
    })
}

main();