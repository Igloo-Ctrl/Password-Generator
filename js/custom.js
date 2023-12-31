function main() {
    updateInitialHistory();
    setupClearHistoryButton();
    setupSliderAndInput();
    randomiseButton();
    setupCopyButton();
    setupGenerateButton();
    generatePassword();
    calculatePasswordLength();
}

function setupSliderAndInput() {

    const customInputs = document.getElementsByClassName("custom-input");
    const customSliders = document.getElementsByClassName("custom-slider");

    const MIN_SHIFT_VALUE = 0;
    const MAX_SHIFT_VALUE = 25;
    const DEFAULT_SLIDER_VALUE = 3;

    let customInputLength = customInputs.length
    for (let i = 0; i < customInputLength; i++) {

        customSliders[i].addEventListener("input", function () {
            customInputs[i].value = customSliders[i].value;
            calculatePasswordLength();
        })

        customInputs[i].addEventListener("input", function() {
            calculatePasswordLength();
        })

        customSliders[i].min = MIN_SHIFT_VALUE;
        customSliders[i].max = MAX_SHIFT_VALUE;
        customSliders[i].value = DEFAULT_SLIDER_VALUE;
        customInputs[i].value = customSliders[i].value;

        customInputs[i].addEventListener("change", function () {
            const lengthInputValue = parseInt(customInputs[i].value);
            // check for non-number inputs, not robust enough #TO-DO
            if (Number.isNaN(lengthInputValue)) {
                customInputs[i].value = MIN_SHIFT_VALUE;
            }

            if (lengthInputValue < MIN_SHIFT_VALUE) {
                customInputs[i].value = MIN_SHIFT_VALUE;
            } else if (lengthInputValue > MAX_SHIFT_VALUE) {
                customInputs[i].value = MAX_SHIFT_VALUE;
            }
        })
    }
}

function generatePassword() {

    const excludedCharacters = document.getElementById("excluded-characters").value.toString().split("");
    const excludedCharactersSet = new Set(excludedCharacters);

    const characterSet = returnRelevantDict();

    const customInputs = document.getElementsByClassName("custom-input");

    let selectedCharacters = getSelectedCharacters(customInputs);
    let password = "";
    for (const key in selectedCharacters) {
        for (let i = 0; i < selectedCharacters[key]; i++) {

            const currentSet = characterSet[key];
            let selectedCharacter;
            let randomCharacter;

            // while the selected letter is in the excluded characters set, pick another
            do {
                randomCharacter = Math.floor(Math.random() * currentSet.length);
                selectedCharacter = currentSet[randomCharacter];
            } while (excludedCharactersSet.has(selectedCharacter));

            password += selectedCharacter;
        }
    }

    document.getElementById("result").value = shuffleString(password);
    updateHistoryAndLocalStorage(password);

}

function getSelectedCharacters(inputs) {
    // returns a dict containing the character set and how many times it should be generated
    let selectedCharacters = {};
    let passwordLength = 0;
    for (let i = 0; i < inputs.length; i++) {
        selectedCharacters[inputs[i].id] = inputs[i].value;
        passwordLength += inputs.value;
    }
    return selectedCharacters;
}

function returnRelevantDict() {

    const characterSetAmbiguous = {
        lowercase: "abcdefghijklmnopqrstuvwxyz",
        uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        numbers: "0123456789",
        special: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"
    };

    const characterSetUnambiguous = {
        lowercase: "abcdefghjkmnpqrstuvwxyz", // removed i, o, l
        uppercase: "ABCDEFGHJKLMNPQRSTUVWXYZ", // removed I, O
        numbers: "346789", // removed 0, 1, 2, 5
        special: "!\"#$%&'()*+,-.:;<=>?@^_`{|}~" // removed \/
    };

    if (document.getElementById("ambiguous").checked) {
        return characterSetUnambiguous;
    } else {
        return characterSetAmbiguous;
    }
}

function randomiseButton() {
    // randomise the various inputs
    document.getElementById("randomise-button").addEventListener("click", function () {
        const customInputs = document.getElementsByClassName("custom-input");
        const customSliders = document.getElementsByClassName("custom-slider");

        const maxSliderLength = document.getElementsByClassName("custom-slider")[0].max
        const customInputsLength = customInputs.length;
        for (let i = 0; i < customInputsLength; i++) {
            customInputs[i].value = Math.floor(Math.random() * maxSliderLength + 1); // 0 - 25
            customSliders[i].value = customInputs[i].value;
        }
        calculatePasswordLength();
    })
}

function shuffleString(inputString) {

    // convert the string to an array of characters
    const charArray = inputString.split('');

    // shuffle the array using the Fisher-Yates algorithm
    for (let i = charArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [charArray[i], charArray[j]] = [charArray[j], charArray[i]];
    }

    // join the shuffled characters back into a string and return
    return charArray.join('');
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

function setupGenerateButton() {
    document.getElementById("generate-button").addEventListener("click", function () {
        generatePassword();
    })
}

function setupClearHistoryButton() {
    document.getElementById("clear-button").addEventListener("click", function () {
        const passwords = document.getElementsByClassName("password");
        const passwordsArray = Array.from(passwords);

        passwordsArray.forEach(item => {
            item.remove();
        })

        localStorage.removeItem("customPasswordHistory");
    })
}

function updateHistoryAndLocalStorage(password) {
    const key = "customPasswordHistory";
    let passwordArray = [];

    // checks if local storage exists
    if (localStorage.getItem(key)) {
        passwordArray = JSON.parse(localStorage.getItem(key));
    }

    // updates the local storage
    passwordArray.push(password);
    const escapedPassword = escapeHtml(password);
    localStorage.setItem(key, JSON.stringify(passwordArray));

    const history = document.getElementById("history");
    const passwordListItem = document.createElement("li");
    passwordListItem.className = "password";
    passwordListItem.innerHTML = `<samp>${escapedPassword}</samp>`;
    history.appendChild(passwordListItem);
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function updateInitialHistory() {
    // updates the initial history once so the dom doesn't need to be constantly regenerated
    const key = "customPasswordHistory";
    if (localStorage.getItem(key)) {
        const passwordArray = JSON.parse(localStorage.getItem(key));
        passwordArray.forEach(item => {
            const history = document.getElementById("history");
            const passwordListItem = document.createElement("li");
            passwordListItem.className = "password";
            passwordListItem.innerHTML = `<samp>${item}</samp>`;
            history.appendChild(passwordListItem);
        })
    }
}

function calculatePasswordLength() {
    const customInputs = document.getElementsByClassName("custom-input");
    const passwordLengthText = document.getElementById("password-length");

    let total = 0;
    for (let i = 0; i < customInputs.length; i++) {
        total += parseInt(customInputs[i].value);
    }
    if (total === 0) {
        passwordLengthText.innerText = "😞 "
    } else {
        passwordLengthText.innerText = `Password length: ${total}`;
    }
}


main();