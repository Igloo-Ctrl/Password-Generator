function main() {
    setupGenerateButton();
}

function generateCipher() {
    const keyword = document.getElementById("keyword-input").value.toString();
    const originalText = document.getElementById("original-text").value;

    // checks if the keyword contains only letters, if not, return early
    const errorMessage = document.getElementById("error-message");
    if (originalText.length === 0) {
        return errorMessage.innerText = 'Please enter some text to generate a cipher.'
    } else if (keyword.length === 0) {
        return errorMessage.innerText = "Please enter a keyword."
    } else if (!keyword.match(/^[A-Za-z]+$/)) {
        return errorMessage.innerText = "Please enter a keyword that only contains letters."
    }

    // lengthens the keyword if necessary and returns an offset array
    const offsets = keywordIntoOffsets(adjustKeyword(keyword));

    let convertedText = "";
    for (let i = 0; i < originalText.length; i++) {

        // skips the character if not alpha
        if (!originalText[i].match(/^[A-Za-z]+$/)) {
            convertedText += originalText[i];
            continue;
        }

        let convertedCharacter = originalText.charCodeAt(i)

        // if a character has gotten to this point, it must be a letter
        // checks if it is a lowercase or uppercase and then deals with the potential wraparound
        if (convertedCharacter >= 97 && convertedCharacter <= 122) {
            convertedCharacter += offsets[i]
            if (convertedCharacter < 97) {
                convertedCharacter += 26;
            } else if (convertedCharacter > 122) {
                convertedCharacter -= 26;
            }
        } else {
            convertedCharacter += offsets[i]
            if (convertedCharacter < 65) {
                convertedCharacter += 26;
            } else if (convertedCharacter > 90) {
                convertedCharacter -= 26;
            }
        }
        // converts characters back from ascii
        convertedText += String.fromCodePoint(convertedCharacter);
    }

    document.getElementById("ciphered-text").value = convertedText;
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

function setupGenerateButton() {
    document.getElementById("generate-button").addEventListener("click", generateCipher);
}

main();