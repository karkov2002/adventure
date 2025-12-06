import { Page } from '../models/Page.js';

export class StorageManager {
    constructor(pageManager, linkManager, idGenerator) {
        this.pageManager = pageManager;
        this.linkManager = linkManager;
        this.idGenerator = idGenerator;
    }

    save() {
        const pages = this.pageManager.getAllPages().map(page => {
            // Récupérer tous les liens qui partent de cette page
            const links = this.linkManager.getAllLinks()
                .filter(link => link.sourcePageId === page.id)
                .sort((a, b) => a.sourceAnchorIndex - b.sourceAnchorIndex) // Trier par index d'ancre
                .map(link => link.targetPageId.toString().padStart(10, '0'));

            return {
                id: page.id.toString().padStart(10, '0'),
                title: page.title,
                x: page.x,
                y: page.y,
                pageNumber: page.pageNumber,
                linksTo: links
            };
        });

        const data = {
            version: "1.0",
            created: new Date().toISOString(),
            pages: pages
        };

        return JSON.stringify(data, null, 2);
    }

    load(jsonString) {
        try {
            const data = JSON.parse(jsonString);

            if (!data.pages) {
                throw new Error("Format JSON invalide");
            }

            // Réinitialiser
            this.pageManager.pages = [];
            this.linkManager.links = [];

            // Mapper les IDs string vers les IDs numériques
            const idMap = new Map();
            let maxNumericId = 0;

            // Recréer les pages avec la classe Page
            data.pages.forEach(pageData => {
                const numericId = parseInt(pageData.id, 10);
                maxNumericId = Math.max(maxNumericId, numericId);

                // Créer une vraie instance de Page
                const page = new Page(
                    numericId,
                    pageData.x,
                    pageData.y,
                    pageData.title,
                    pageData.pageNumber
                );

                // Calculer le nombre d'ancres sortantes en fonction du nombre de liens
                page.anchorsOut = pageData.linksTo ? pageData.linksTo.length : 1;
                // S'assurer qu'il y a au moins une ancre
                if (page.anchorsOut === 0) {
                    page.anchorsOut = 1;
                }

                this.pageManager.pages.push(page);
                idMap.set(pageData.id, numericId);
            });

            // Mettre à jour les compteurs
            this.pageManager.pageCounter = this.pageManager.pages.length;
            this.idGenerator.setCounter(maxNumericId);

            // Recalculer nextX et nextY en fonction de la dernière page
            if (this.pageManager.pages.length > 0) {
                const lastPage = this.pageManager.pages[this.pageManager.pages.length - 1];
                this.pageManager.nextX = lastPage.x + 30;
                this.pageManager.nextY = lastPage.y + 30;
            }

            // Recréer les liens
            data.pages.forEach(pageData => {
                const sourceId = idMap.get(pageData.id);

                if (sourceId && pageData.linksTo) {
                    pageData.linksTo.forEach((targetIdStr, index) => {
                        const targetId = idMap.get(targetIdStr);

                        if (targetId) {
                            // L'index de l'ancre correspond à la position dans le tableau + 1
                            this.linkManager.addLink(sourceId, index + 1, targetId);
                        }
                    });
                }
            });

            return true;
        } catch (error) {
            console.error("Erreur lors du chargement:", error);
            return false;
        }
    }
}