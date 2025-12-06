export class SelectionManager {
    constructor() {
        this.draggedPage = null;
        this.dragOffsetX = 0;
        this.dragOffsetY = 0;
        this.isDraggingCanvas = false;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
    }

    startDraggingPage(page, offsetX, offsetY) {
        this.draggedPage = page;
        this.dragOffsetX = offsetX;
        this.dragOffsetY = offsetY;
    }

    updatePagePosition(worldX, worldY) {
        if (this.draggedPage) {
            this.draggedPage.x = worldX - this.dragOffsetX;
            this.draggedPage.y = worldY - this.dragOffsetY;
        }
    }

    stopDraggingPage() {
        this.draggedPage = null;
    }

    isDraggingPage() {
        return this.draggedPage !== null;
    }

    getDraggedPage() {
        return this.draggedPage;
    }

    startDraggingCanvas(mouseX, mouseY) {
        this.isDraggingCanvas = true;
        this.lastMouseX = mouseX;
        this.lastMouseY = mouseY;
    }

    updateCanvasDrag(mouseX, mouseY) {
        if (this.isDraggingCanvas) {
            const dx = mouseX - this.lastMouseX;
            const dy = mouseY - this.lastMouseY;
            this.lastMouseX = mouseX;
            this.lastMouseY = mouseY;
            return { dx, dy };
        }
        return null;
    }

    stopDraggingCanvas() {
        this.isDraggingCanvas = false;
    }

    isDraggingCanvasNow() {
        return this.isDraggingCanvas;
    }
}