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
    const excludedCharacters = document.getElementById("excluded-characters").toString().split("");

    const characterSetAmbiguous = {
        lowercase: "abcdefghijklmnopqrstuvwxyz",
        uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        numbers: "0123456789",
        special: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"
    };

    const customInputs = document.getElementsByClassName("custom-input");
    const customInputsLength = customInputs.length;


    // iterate through each input and grab its value
    // at the same time, iterate through each dict and access its key
    // randomly select a value based on the length of the key

    let password = "";
    for (const key in characterSetAmbiguous) {
        for (int i = 0; i < )
    }

    // let selectedCharacters = {};
    // let passwordLength = 0;
    // for (let i = 0; i < customInputsLength; i++) {
    //     selectedCharacters[customInputs[i].id] = customInputs[i].value;
    //     passwordLength += customInputs.value;
    // }

    // let password;
    // for (let i = 0; i < customInputsLength; i++) {
    //     const currentCustomInput = customInputs[i];
    //     for (let j = 0; j < currentCustomInput.length; j++) {
    //         const choice = selectedCharacters[Math.floor(Math.random() * customInputs[i].length)];
    //         const charSet = characterSetAmbiguous[choice];
    //         const chosenCharacter = charSet[Math.floor(Math.random() * charSet.length)];
    //         password += chosenCharacter;
    //     }
    // }

}

function randomiseButton() {
    document.getElementById("randomise-button").addEventListener("click", function () {
        const customInputs = document.getElementsByClassName("custom-input");
        const customSliders = document.getElementsByClassName("custom-slider");


        const maxSliderLength = document.getElementsByClassName("custom-slider")[0].max
        const customInputsLength = customInputs.length;
        for (let i = 0; i < customInputsLength; i++) {
            customInputs[i].value = Math.floor(Math.random() * maxSliderLength);
            customSliders[i].value = customInputs[i].value;
        }
    })
}

document.getElementById("generate-button").addEventListener("click", function () {
    generatePassword();
})

setupSliderAndInput();
randomiseButton();