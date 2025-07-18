const form = document.querySelector("form");
const inputs = form.querySelectorAll("input, textarea");
const radioContainers = form.querySelectorAll(".radio-container");
const textareas = form.querySelectorAll("textarea");


document.addEventListener("DOMContentLoaded", () => {
    form.addEventListener("submit", handleSubmit);

    // Set tabbing class on root element
    toggleTabbingClass();

    // Validate inputs on blur event
    inputs.forEach(validateOnBlur);

    // Make whole radio button containers clickable
    radioContainers.forEach(makeClickable);

    // Set row number of textarea
    textareas.forEach(setTextareaRows);
    window.addEventListener("resize", () => {
        textareas.forEach(setTextareaRows);
    });
});


function validateOnBlur(element) {
    const label = document.querySelector(`label[for="${element.id}"]`);
    let clickedLabel = "";

    // Escape blur event when corresponding label is clicked
    label.addEventListener("pointerdown", () => {
        clickedLabel = label.htmlFor;
        setTimeout(() => clickedLabel = "", 0);
    });

    element.addEventListener("blur", e => {
        if (clickedLabel === e.target.name) {
            return;
        }

        if (!e.relatedTarget || e.target.name !== e.relatedTarget.name) {
            handleValidity(element);
        }
    });
}

function makeClickable(target) {
    target.addEventListener("click", () => {
        const radioButton = target.querySelector("input[type='radio']")
        radioButton.checked = "true";
        radioButton.dispatchEvent(new Event("input"));
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
    const showTime = 6000;
    const transitionTime = Number(
        getComputedStyle(document.documentElement).getPropertyValue("--success-transition-time").replace("s", "")
    ) * 1000;

    const heading = document.createElement("h2");
    const text = document.createElement("p");

    heading.textContent = successMessage.heading;
    text.textContent = successMessage.text;

    successElement.replaceChildren(heading, text);
    successElement.style.opacity = "1";

    sleep(showTime).then(() => {
        successElement.style.opacity = "0";
        setTimeout(() => {
            successElement.replaceChildren();
        }, transitionTime);
    });
}

function setTextareaRows(textarea) {
    const textareaStyle = getComputedStyle(textarea);
    const paddingLeft = parseFloat(textareaStyle.getPropertyValue("padding-left"));
    const paddingRight = parseFloat(textareaStyle.getPropertyValue("padding-right"));

    const width = textarea.clientWidth - paddingLeft - paddingRight
    let rows = Math.round(2000 / width);
    rows = Math.min(rows, 10);
    rows = Math.max(rows, 3);

    textarea.rows = rows;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function toggleTabbingClass() {
    const tabbingClass = "user-tabbing";

    document.addEventListener("keydown", e => {
        if (e.key === "Tab") {
            document.documentElement.classList.add(tabbingClass);
        }
    });

    document.addEventListener("mousedown", () => {
        document.documentElement.classList.remove(tabbingClass);
    });
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
