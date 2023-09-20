function initializePasswordGenerator() {
    updateInitialHistory();
    setupGenerateButton();
    setupSliderAndInput();
    setupCopyButton();
    setupClearHistoryButton();
    generatePassword(getSelectedCharacters());
}

function setupSliderAndInput() {
    const lengthInput = document.getElementById("length-input");
    const lengthSlider = document.getElementById("length-slider");

    const MIN_PASSWORD_LENGTH = 8;
    const MAX_PASSWORD_LENGTH = 128;
    const DEFAULT_SLIDER_VALUE = 12;

    // slider values
    lengthSlider.min = MIN_PASSWORD_LENGTH;
    lengthSlider.max = MAX_PASSWORD_LENGTH;
    lengthSlider.value = DEFAULT_SLIDER_VALUE;
    lengthInput.value = lengthSlider.value;

    // update input when slider changes
    lengthSlider.addEventListener("input", function () {
        lengthInput.value = lengthSlider.value;
    });

    // enforce min and max
    lengthInput.addEventListener("change", function () {
        const lengthInputValue = parseInt(lengthInput.value);

        // check for non-number inputs, not robust enough #TO-DO
        if (Number.isNaN(lengthInputValue)) {
            lengthInput.value = MIN_PASSWORD_LENGTH;
        }

        if (lengthInputValue < MIN_PASSWORD_LENGTH) {
            lengthInput.value = lengthSlider.min;
        } else if (lengthInputValue > MAX_PASSWORD_LENGTH) {
            lengthInput.value = lengthSlider.max;
        }
    });
}

function setupGenerateButton() {
    const generateButton = document.getElementById("generate-button");
    generateButton.addEventListener("click", function () {
        const selectedCharacters = getSelectedCharacters();
        const errorMessage = document.getElementById("error-message")
        if (selectedCharacters.length === 0) {
            errorMessage.textContent = "Please select at least one character set.";
        } else {
            errorMessage.textContent = String.fromCharCode(160); // blank character
            generatePassword(selectedCharacters);
        }
    });
}

// creates an array of the user selected character sets
function getSelectedCharacters() {
    const checkboxes = document.getElementsByClassName("checkboxes");
    const selectedCharacters = [];
    Array.from(checkboxes).forEach(function (checkbox) {
        if (checkbox.checked) {
            selectedCharacters.push(checkbox.id);
        }
    });
    return selectedCharacters;
}

function generatePassword(selectedCharacters) {

    const characterSetAmbiguous = {
        lowercase: "abcdefghijklmnopqrstuvwxyz",
        uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        numbers: "0123456789",
        special: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"
    };

    // removed
    const characterSetUnambiguous = {
        lowercase: "abcdefghjkmnpqrstuvwxyz", // removed i, o, l
        uppercase: "ABCDEFGHJKLMNPQRSTUVWXYZ", // removed I, O
        numbers: "346789", // removed 0, 1, 2, 5
        special: "!\"#$%&'()*+,-.:;<=>?@^_`{|}~" // removed \/
    };

    // determines which character set is to be used
    let characterSet;
    if (document.getElementById("ambiguous").checked) {
        characterSet = characterSetUnambiguous;
    } else {
        characterSet = characterSetAmbiguous;
    }

    // generates the password by selecting random indexes of random character sets
    let password = "";
    const passwordLength = document.getElementById("length-input").value;
    for (let i = 0; i < passwordLength; i++) {
        const choice = selectedCharacters[Math.floor(Math.random() * selectedCharacters.length)];
        const charSet = characterSet[choice];
        const chosenCharacter = charSet[Math.floor(Math.random() * charSet.length)];
        password += chosenCharacter;
    }

    document.getElementById("result").value = password;
    updateHistoryAndLocalStorage(password);
    calculatePermutations(passwordLength, characterSet, selectedCharacters);

}

function updateHistoryAndLocalStorage(password) {
    const key = "passwordHistory";
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

// updates the initial history once so the dom doesn't need to be constantly regenerated
function updateInitialHistory() {
    const key = "passwordHistory";
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
// replaces problematic characters that might interfere with the html
function escapeHtml(unsafe) {
    return unsafe
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// calculate the possible permutations of a password with the selected characters
function calculatePermutations(passwordLength, characterSets, selectedCharacters) {

    let total = 0;
    selectedCharacters.forEach(item => {
        total += characterSets[item].length;
    })

    const permutations = total ** passwordLength;
    document.getElementById("permutations").innerText = `A password with a length of ${passwordLength} and utilising ${total} characters has approximately ${permutations} permutations!`;

}

function setupCopyButton() {
    document.getElementById("copy-button").addEventListener("click", function () {
        const result = document.getElementById("result");
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

function setupClearHistoryButton() {
    document.getElementById("clear-button").addEventListener("click", function () {
        const passwords = document.getElementsByClassName("password");
        const passwordsArray = Array.from(passwords);

        passwordsArray.forEach(item => {
            item.remove();
        })

        localStorage.removeItem("passwordHistory");
    })
}

initializePasswordGenerator();
