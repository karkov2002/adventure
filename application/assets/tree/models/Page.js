export class Page {
    constructor(id, x, y, title, pageNumber) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = 180;
        this.height = 120;
        this.title = title;
        this.pageNumber = pageNumber;
        this.anchorsOut = 1;
    }

    contains(x, y) {
        return x >= this.x && x <= this.x + this.width &&
            y >= this.y && y <= this.y + this.height;
    }

    containsTitle(x, y) {
        return x >= this.x + 10 && x <= this.x + this.width - 10 &&
            y >= this.y + 10 && y <= this.y + 30;
    }

    getAnchorInPosition() {
        return { x: this.x, y: this.y + this.height / 2 };
    }

    getAnchorOutPosition(index) {
        const spacing = this.height / (this.anchorsOut + 1);
        return { x: this.x + this.width, y: this.y + spacing * index };
    }

    isPointInAnchorOut(x, y, index) {
        const pos = this.getAnchorOutPosition(index);
        const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
        return distance <= 10;
    }

    isPointInAnchorIn(x, y) {
        const pos = this.getAnchorInPosition();
        const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
        return distance <= 12;
    }

    isPointInDeleteButton(x, y) {
        const btnX = this.x + this.width - 24;
        const btnY = this.y + 4;
        return x >= btnX && x <= btnX + 20 &&
            y >= btnY && y <= btnY + 20;
    }

    isPointInPlusButton(x, y) {
        const btnX = this.x + this.width - 30;
        const btnY = this.y + this.height / 2 - 18;
        return x >= btnX && x <= btnX + 18 &&
            y >= btnY && y <= btnY + 18;
    }

    isPointInMinusButton(x, y) {
        const btnX = this.x + this.width - 30;
        const btnY = this.y + this.height / 2 + 2;
        return x >= btnX && x <= btnX + 18 &&
            y >= btnY && y <= btnY + 18;
    }

    isPointInDeleteIncomingLinksButton(x, y) {
        const anchorPos = this.getAnchorInPosition();
        const btnX = anchorPos.x + 4;
        const btnY = anchorPos.y - 8;
        return x >= btnX && x <= btnX + 16 &&
            y >= btnY && y <= btnY + 16;
    }
}