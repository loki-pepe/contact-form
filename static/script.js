const form = document.querySelector("form");


document.addEventListener("DOMContentLoaded", () => {
    form.addEventListener("submit", handleSubmit);
});


function getErrorMessage(element) {
    if (element.type !== "email") {
        return document.querySelector(`#${element.name}-error`);
    } else {
        if (element.validity.valueMissing) {
            return document.querySelector("#email-missing");
        } else {
            return document.querySelector("#email-invalid");
        }
    }
}

function handleElementError(element) {
    const errorMessage = getErrorMessage(element);
    errorMessage.removeAttribute("hidden");

    element.setAttribute("aria-invalid", "true");
    element.classList.add("invalid");
    element.addEventListener("input", hideError);

    function hideError() {
        errorMessage.setAttribute("hidden", "");
        element.removeAttribute("aria-invalid");
        element.classList.remove("invalid");
        element.removeEventListener("input", hideError);
    }
}

function handleFormError(e) {
    for (let element of form) {
        if (!element.checkValidity()) handleElementError(element);
    }
}

function handleSubmit(e) {
    e.preventDefault();
    form.checkValidity() ? handleSuccess() : handleFormError(e);
}

function handleSuccess() {
    form.reset();
    popSuccessMessage();
}

function popSuccessMessage() {
    const successMessage = document.querySelector("#success-message");
    successMessage.removeAttribute("hidden");
    setTimeout(() => {
        successMessage.setAttribute("hidden", "");
    }, 5000);
}
