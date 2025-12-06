export class Canvas {
    constructor(canvasId) {
        this.element = document.getElementById(canvasId);
        this.ctx = this.element.getContext('2d');
        this.wrapper = this.element.parentElement;
    }

    resize() {
        this.element.width = this.wrapper.clientWidth;
        this.element.height = this.wrapper.clientHeight;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.element.width, this.element.height);
    }

    getContext() {
        return this.ctx;
    }

    getElement() {
        return this.element;
    }

    getWidth() {
        return this.element.width;
    }

    getHeight() {
        return this.element.height;
    }

    addCursorClass(className) {
        this.element.classList.add(className);
    }

    removeCursorClass(className) {
        this.element.classList.remove(className);
    }
}