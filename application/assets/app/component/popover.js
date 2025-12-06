import Popover from "bootstrap/js/src/popover";

const popoverEls = document.querySelectorAll('[data-bs-toggle="popover"]');
popoverEls.forEach((el) => {
    new Popover(el, {});
});
