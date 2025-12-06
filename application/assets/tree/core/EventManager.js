export class EventManager {
    constructor(canvas, viewport, pageManager, linkManager, selectionManager, titleEditor, storageManager, onRender) {
        this.canvas = canvas;
        this.viewport = viewport;
        this.pageManager = pageManager;
        this.linkManager = linkManager;
        this.selectionManager = selectionManager;
        this.titleEditor = titleEditor;
        this.storageManager = storageManager;
        this.onRender = onRender;
    }

    attachListeners() {
        const canvasElement = this.canvas.getElement();

        canvasElement.addEventListener('mousedown', (e) => this.onMouseDown(e));
        canvasElement.addEventListener('mousemove', (e) => this.onMouseMove(e));
        canvasElement.addEventListener('mouseup', (e) => this.onMouseUp(e));
        canvasElement.addEventListener('wheel', (e) => this.onWheel(e));
        canvasElement.addEventListener('dblclick', (e) => this.onDoubleClick(e));

        window.addEventListener('resize', () => {
            this.canvas.resize();
            this.onRender();
        });

        // Tool: Ajouter une page
        const addPageTool = document.getElementById('add-page-tool');
        if (addPageTool) {
            addPageTool.addEventListener('click', () => {
                this.pageManager.addPage();
                this.onRender();
            });
        }

        // Tool: Sauvegarder
        const saveTool = document.getElementById('save-tool');
        if (saveTool) {
            saveTool.addEventListener('click', () => {
                const jsonData = this.storageManager.save();
                const textarea = document.getElementById('json-data');
                if (textarea) {
                    textarea.value = jsonData;
                    console.log("Données sauvegardées:", jsonData);
                    // Pas d'alerte, juste affichage dans le textarea
                }
            });
        }

        // Tool: Charger
        const loadTool = document.getElementById('load-tool');
        if (loadTool) {
            loadTool.addEventListener('click', () => {
                const textarea = document.getElementById('json-data');
                if (textarea && textarea.value.trim()) {
                    if (confirm("Charger les données va écraser le projet actuel. Continuer ?")) {
                        const success = this.storageManager.load(textarea.value);
                        if (success) {
                            alert("Projet chargé avec succès !");
                            this.onRender();
                        } else {
                            alert("Erreur lors du chargement du projet.");
                        }
                    }
                } else {
                    alert("Aucune donnée à charger dans le textarea.");
                }
            });
        }
    }

    getMousePos(e) {
        const rect = this.canvas.getElement().getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    onMouseDown(e) {
        const mousePos = this.getMousePos(e);
        const worldPos = this.viewport.screenToWorld(mousePos.x, mousePos.y);

        // Vérifier les boutons "X" (supprimer page)
        const pages = this.pageManager.getAllPages();
        for (let i = pages.length - 1; i >= 0; i--) {
            const page = pages[i];

            if (page.isPointInDeleteButton(worldPos.x, worldPos.y)) {
                if (confirm(`Êtes-vous sûr de vouloir supprimer "${page.title}" ?`)) {
                    this.linkManager.removeLinksForPage(page.id);
                    this.pageManager.removePage(page.id);
                    this.onRender();
                }
                return;
            }
        }

        // Vérifier les boutons "x" pour supprimer les liens entrants
        for (let i = pages.length - 1; i >= 0; i--) {
            const page = pages[i];
            if (page.isPointInDeleteIncomingLinksButton(worldPos.x, worldPos.y)) {
                const removed = this.linkManager.removeIncomingLinks(page.id);
                if (removed) {
                    this.onRender();
                }
                return;
            }
        }

        // Vérifier les boutons "+"
        for (let i = pages.length - 1; i >= 0; i--) {
            const page = pages[i];
            if (page.isPointInPlusButton(worldPos.x, worldPos.y)) {
                page.anchorsOut++;
                this.onRender();
                return;
            }
        }

        // Vérifier les boutons "-"
        for (let i = pages.length - 1; i >= 0; i--) {
            const page = pages[i];
            if (page.isPointInMinusButton(worldPos.x, worldPos.y)) {
                if (page.anchorsOut > 0) {
                    this.linkManager.removeLinksForAnchor(page.id, page.anchorsOut);
                    page.anchorsOut--;
                    this.onRender();
                }
                return;
            }
        }

        // Vérifier si on clique sur une ancre sortante (pour créer un lien)
        for (let i = pages.length - 1; i >= 0; i--) {
            const page = pages[i];
            for (let j = 1; j <= page.anchorsOut; j++) {
                if (page.isPointInAnchorOut(worldPos.x, worldPos.y, j)) {
                    // Vérifier si un lien existe déjà depuis cette ancre
                    if (this.linkManager.hasLinkFromAnchor(page.id, j)) {
                        // Ne rien faire, un lien existe déjà
                        return;
                    }

                    const anchorPos = page.getAnchorOutPosition(j);
                    const started = this.linkManager.startTempLink(page, j, anchorPos.x, anchorPos.y);
                    if (!started) {
                        // Un lien existe déjà, ne rien faire
                        return;
                    }
                    return;
                }
            }
        }

        // Vérifier si on clique sur une page
        for (let i = pages.length - 1; i >= 0; i--) {
            const page = pages[i];
            if (page.contains(worldPos.x, worldPos.y)) {
                this.selectionManager.startDraggingPage(
                    page,
                    worldPos.x - page.x,
                    worldPos.y - page.y
                );
                this.pageManager.bringToFront(page);
                return;
            }
        }

        // Sinon, on déplace le canvas
        this.selectionManager.startDraggingCanvas(mousePos.x, mousePos.y);
        this.canvas.addCursorClass('grabbing');
    }

    onMouseMove(e) {
        const mousePos = this.getMousePos(e);
        const worldPos = this.viewport.screenToWorld(mousePos.x, mousePos.y);

        const tempLink = this.linkManager.getTempLink();
        if (tempLink) {
            this.linkManager.updateTempLink(worldPos.x, worldPos.y);
            this.onRender();
        } else if (this.selectionManager.isDraggingPage()) {
            this.selectionManager.updatePagePosition(worldPos.x, worldPos.y);
            this.onRender();
        } else if (this.selectionManager.isDraggingCanvasNow()) {
            const delta = this.selectionManager.updateCanvasDrag(mousePos.x, mousePos.y);
            if (delta) {
                this.viewport.pan(delta.dx, delta.dy);
                this.onRender();
            }
        }
    }

    onMouseUp(e) {
        const mousePos = this.getMousePos(e);
        const worldPos = this.viewport.screenToWorld(mousePos.x, mousePos.y);

        const tempLink = this.linkManager.getTempLink();
        if (tempLink) {
            // Vérifier si on drop sur une ancre entrante
            const pages = this.pageManager.getAllPages();
            let linkCreated = false;

            for (let i = 0; i < pages.length; i++) {
                const targetPage = pages[i];
                if (targetPage.id !== tempLink.sourcePage.id) {
                    if (targetPage.isPointInAnchorIn(worldPos.x, worldPos.y)) {
                        const result = this.linkManager.addLink(
                            tempLink.sourcePage.id,
                            tempLink.sourceAnchorIndex,
                            targetPage.id
                        );
                        linkCreated = (result !== null);
                        break;
                    }
                }
            }

            this.linkManager.cancelTempLink();
            this.onRender();
        }

        this.selectionManager.stopDraggingPage();
        this.selectionManager.stopDraggingCanvas();
        this.canvas.removeCursorClass('grabbing');
    }

    onWheel(e) {
        e.preventDefault();
        const mousePos = this.getMousePos(e);
        this.viewport.zoom(e.deltaY, mousePos.x, mousePos.y);
        this.onRender();
    }

    onDoubleClick(e) {
        const mousePos = this.getMousePos(e);
        const worldPos = this.viewport.screenToWorld(mousePos.x, mousePos.y);

        const pages = this.pageManager.getAllPages();
        for (let i = pages.length - 1; i >= 0; i--) {
            const page = pages[i];
            if (page.containsTitle(worldPos.x, worldPos.y)) {
                this.titleEditor.startEditing(page, () => this.onRender());
                return;
            }
        }
    }
}