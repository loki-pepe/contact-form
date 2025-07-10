const form = document.querySelector("form");
const inputs = form.querySelectorAll("input, textarea");


document.addEventListener("DOMContentLoaded", () => {
    form.addEventListener("submit", handleSubmit);
    inputs.forEach(addBlurListener);
});


function addBlurListener(element) {
    element.addEventListener("blur", e => {
        if (!e.relatedTarget || e.target.name !== e.relatedTarget.name) {
            handleValidity(element);
        }
    });
}

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
    const errorElement = getErrorMessage(element);
    errorElement.classList.remove("hidden");

    element.setAttribute("aria-describedby", errorElement.id);
    element.setAttribute("aria-invalid", "true");
    element.classList.add("invalid");
    element.addEventListener("input", hideError);

    function hideError() {
        errorElement.classList.add("hidden");
        element.removeAttribute("aria-describedby");
        element.removeAttribute("aria-invalid");
        element.classList.remove("invalid");
        element.removeEventListener("input", hideError);
    }
}

function handleFormError() {
    inputs.forEach(handleValidity)
}

function handleSubmit(e) {
    e.preventDefault();
    form.checkValidity() ? handleSuccess() : handleFormError(e);
}

function handleSuccess() {
    form.reset();
    popSuccessMessage();
}

function handleValidity(element) {
    if (!element.checkValidity()) handleElementError(element);
}

function popSuccessMessage() {
    const successMessage = document.querySelector("#success-message");
    successMessage.classList.remove("hidden");
    setTimeout(() => {
        successMessage.classList.add("hidden");
    }, 5000);
}
