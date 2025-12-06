export class Viewport {
    constructor(canvas) {
        this.canvas = canvas;
        this.scale = 1;
        this.offsetX = 0;
        this.offsetY = 0;
    }

    screenToWorld(screenX, screenY) {
        return {
            x: (screenX - this.offsetX) / this.scale,
            y: (screenY - this.offsetY) / this.scale
        };
    }

    worldToScreen(worldX, worldY) {
        return {
            x: worldX * this.scale + this.offsetX,
            y: worldY * this.scale + this.offsetY
        };
    }

    zoom(delta, centerX, centerY) {
        const worldPosBefore = this.screenToWorld(centerX, centerY);

        const zoomFactor = delta > 0 ? 0.9 : 1.1;
        this.scale *= zoomFactor;
        this.scale = Math.max(0.1, Math.min(5, this.scale));

        const worldPosAfter = this.screenToWorld(centerX, centerY);
        this.offsetX += (worldPosAfter.x - worldPosBefore.x) * this.scale;
        this.offsetY += (worldPosAfter.y - worldPosBefore.y) * this.scale;
    }

    pan(dx, dy) {
        this.offsetX += dx;
        this.offsetY += dy;
    }

    getScale() {
        return this.scale;
    }
}