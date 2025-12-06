import { Canvas } from './core/Canvas.js';
import { Viewport } from './core/Viewport.js';
import { EventManager } from './core/EventManager.js';
import { PageManager } from './managers/PageManager.js';
import { LinkManager } from './managers/LinkManager.js';
import { SelectionManager } from './managers/SelectionManager.js';
import { StorageManager } from './managers/StorageManager.js';
import { PageRenderer } from './renderers/PageRenderer.js';
import { LinkRenderer } from './renderers/LinkRenderer.js';
import { GridRenderer } from './renderers/GridRenderer.js';
import { TitleEditor } from './ui/TitleEditor.js';
import { IdGenerator } from './utils/IdGenerator.js';

console.log(' --- Tree asset loaded ---');

class TreeCanvas {
    constructor(canvasId) {
        // Core
        this.canvas = new Canvas(canvasId);
        this.viewport = new Viewport(this.canvas.getElement());

        // Utils
        this.idGenerator = new IdGenerator();

        // Managers
        this.pageManager = new PageManager(this.idGenerator);
        this.linkManager = new LinkManager();
        this.selectionManager = new SelectionManager();
        this.storageManager = new StorageManager(this.pageManager, this.linkManager, this.idGenerator);

        // UI
        this.titleEditor = new TitleEditor(this.viewport);

        // Renderers
        this.gridRenderer = new GridRenderer(this.canvas.getContext(), this.viewport);
        this.linkRenderer = new LinkRenderer(this.canvas.getContext(), this.viewport);
        this.pageRenderer = new PageRenderer(this.canvas.getContext(), this.viewport, this.linkManager);

        // Event Manager
        this.eventManager = new EventManager(
            this.canvas,
            this.viewport,
            this.pageManager,
            this.linkManager,
            this.selectionManager,
            this.titleEditor,
            this.storageManager,
            () => this.render()
        );

        this.init();
    }

    init() {
        this.canvas.resize();
        this.eventManager.attachListeners();
        this.render();
    }

    render() {
        this.canvas.clear();

        // Grille
        this.gridRenderer.render(this.canvas.getWidth(), this.canvas.getHeight());

        // Liens permanents
        this.linkRenderer.renderAll(
            this.linkManager.getAllLinks(),
            this.pageManager.getAllPages()
        );

        // Lien temporaire
        this.linkRenderer.renderTempLink(this.linkManager.getTempLink());

        // Pages
        const editingPage = this.titleEditor.getEditingPage();
        this.pageManager.getAllPages().forEach(page => {
            this.pageRenderer.render(page, editingPage);
        });
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    new TreeCanvas('main-canvas');
});