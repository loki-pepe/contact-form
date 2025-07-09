const form = document.querySelector("form");

document.addEventListener("DOMContentLoaded", () => {
    form.addEventListener("submit", handleSubmit);
});

function handleSubmit(e) {
    e.preventDefault();
    if (form.checkValidity()) {
        alert("Good");
    } else {
        alert("Bad!")
    }
}
