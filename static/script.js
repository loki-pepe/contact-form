const form = document.querySelector("form");
const inputs = form.querySelectorAll("input, textarea");
const radioLabelContainers = form.querySelectorAll(".radio-label-group");


document.addEventListener("DOMContentLoaded", () => {
    form.addEventListener("submit", handleSubmit);
    inputs.forEach(addBlurListener);
    radioLabelContainers.forEach(addClickListener);
});


function addBlurListener(element) {
    const label = document.querySelector(`label[for="${element.id}"]`);
    let clickedLabel = "";

    label.addEventListener("pointerdown", () => {
        clickedLabel = label.htmlFor;
        setTimeout(() => clickedLabel = "", 0);
    });

    element.addEventListener("blur", e => {
        // Escape blur event if label of blurred element is clicked
        if (clickedLabel == e.target.name) {
            return;
        }

        if (!e.relatedTarget || e.target.name !== e.relatedTarget.name) {
            handleValidity(element);
        }
    });
}

function addClickListener(target) {
    target.addEventListener("click", () => {
        const radioButton = target.querySelector("input[type='radio']")
        radioButton.checked = "true";
    })
}

function getErrorElement(element) {
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
    const errorElement = getErrorElement(element);

    const errorContentEl = document.createElement("p");

    errorContentEl.textContent = errorMessages[errorElement.id];
    errorElement.replaceChildren(errorContentEl);

    element.setAttribute("aria-describedby", errorElement.id);
    element.setAttribute("aria-invalid", "true");
    element.classList.add("invalid");
    element.addEventListener("input", hideError);

    function hideError() {
        errorElement.replaceChildren();

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
    const successElement = document.querySelector("#success-message");
    const transitionTime = Number(
        getComputedStyle(document.documentElement).getPropertyValue("--success-transition-time").replace("s", "")
    ) * 1000;

    const heading = document.createElement("h2");
    const text = document.createElement("p");

    heading.textContent = successMessage.heading;
    text.textContent = successMessage.text;

    successElement.replaceChildren(heading, text);
    successElement.style.opacity = "1";

    sleep(5000).then(() => {
        successElement.style.opacity = "0";
        setTimeout(() => {
            successElement.replaceChildren();
        }, transitionTime);
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const errorMessages = {
    "first-name-error": "This field is required",
    "last-name-error": "This field is required",
    "email-missing": "This field is required",
    "email-invalid": "Please enter a valid email address",
    "query-type-error": "Please select a query type",
    "message-error": "This field is required",
    "consent-error": "To submit this form, please consent to being contacted"
}

const successMessage = {
    "heading": "Message Sent!",
    "text": "Thanks for completing the form. We'll be in touch soon!"
}
