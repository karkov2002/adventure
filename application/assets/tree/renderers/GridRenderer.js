export class GridRenderer {
    constructor(ctx, viewport) {
        this.ctx = ctx;
        this.viewport = viewport;
    }

    render(canvasWidth, canvasHeight) {
        const scale = this.viewport.getScale();
        const gridSize = 50 * scale;
        const startX = this.viewport.offsetX % gridSize;
        const startY = this.viewport.offsetY % gridSize;

        this.ctx.strokeStyle = '#e0e0e0';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();

        for (let x = startX; x < canvasWidth; x += gridSize) {
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, canvasHeight);
        }

        for (let y = startY; y < canvasHeight; y += gridSize) {
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(canvasWidth, y);
        }

        this.ctx.stroke();
    }
}