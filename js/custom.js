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
    const excludedCharacters = document.getElementById("excluded-characters");
    const excludedCharactersArray = excludedCharacters.toString().split("");
    excludedCharactersArray.forEach(character => {
        console.log(character);
    })
}

document.getElementById("generate-button").addEventListener("click", function () {
    generatePassword();
})

setupSliderAndInput();