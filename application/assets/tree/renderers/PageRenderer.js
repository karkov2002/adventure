export class PageRenderer {
    constructor(ctx, viewport, linkManager) {
        this.ctx = ctx;
        this.viewport = viewport;
        this.linkManager = linkManager;
    }

    render(page, editingPage = null) {
        const screenPos = this.viewport.worldToScreen(page.x, page.y);
        const width = page.width * this.viewport.getScale();
        const height = page.height * this.viewport.getScale();
        const scale = this.viewport.getScale();

        // Rectangle principal
        this.drawRectangle(screenPos, width, height);

        // Titre
        if (editingPage !== page) {
            this.drawTitle(page, screenPos, scale);
        }

        // Bouton de suppression
        this.drawDeleteButton(screenPos, width, scale);

        // Ancre entrante
        this.drawAnchorIn(page, screenPos, height, scale);

        // Ancres sortantes
        this.drawAnchorsOut(page, screenPos, width, height, scale);

        // Boutons de contrôle
        this.drawControlButtons(screenPos, width, height, scale);
    }

    drawRectangle(screenPos, width, height) {
        this.ctx.fillStyle = 'white';
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.fillRect(screenPos.x, screenPos.y, width, height);
        this.ctx.strokeRect(screenPos.x, screenPos.y, width, height);
    }

    drawTitle(page, screenPos, scale) {
        this.ctx.fillStyle = '#333';
        this.ctx.font = `bold ${14 * scale}px Arial`;
        this.ctx.textBaseline = 'top';
        this.ctx.fillText(page.title, screenPos.x + 10 * scale, screenPos.y + 10 * scale);
    }

    drawDeleteButton(screenPos, width, scale) {
        const deleteSize = 20 * scale;
        const deleteX = screenPos.x + width - 24 * scale;
        const deleteY = screenPos.y + 4 * scale;

        this.ctx.fillStyle = '#f44336';
        this.ctx.fillRect(deleteX, deleteY, deleteSize, deleteSize);
        this.ctx.strokeStyle = '#c62828';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(deleteX, deleteY, deleteSize, deleteSize);

        // Croix blanche
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(deleteX + 5 * scale, deleteY + 5 * scale);
        this.ctx.lineTo(deleteX + deleteSize - 5 * scale, deleteY + deleteSize - 5 * scale);
        this.ctx.moveTo(deleteX + deleteSize - 5 * scale, deleteY + 5 * scale);
        this.ctx.lineTo(deleteX + 5 * scale, deleteY + deleteSize - 5 * scale);
        this.ctx.stroke();
    }

    drawAnchorIn(page, screenPos, height, scale) {
        const anchorInPos = page.getAnchorInPosition();
        const screenAnchorIn = this.viewport.worldToScreen(anchorInPos.x, anchorInPos.y);

        const anchorSize = 14 * scale;
        this.ctx.fillStyle = '#4CAF50';
        this.ctx.beginPath();
        this.ctx.moveTo(screenPos.x, screenPos.y + height / 2);
        this.ctx.lineTo(screenPos.x - anchorSize, screenPos.y + height / 2 - anchorSize / 2);
        this.ctx.lineTo(screenPos.x - anchorSize, screenPos.y + height / 2 + anchorSize / 2);
        this.ctx.closePath();
        this.ctx.fill();

        // Bouton "x" pour supprimer les liens entrants
        const hasIncomingLinks = this.linkManager.hasIncomingLinks(page.id);

        if (hasIncomingLinks) {
            const btnSize = 16 * scale;
            const btnX = screenAnchorIn.x + 4 * scale;
            const btnY = screenAnchorIn.y - 8 * scale;

            this.ctx.fillStyle = '#f44336';
            this.ctx.fillRect(btnX, btnY, btnSize, btnSize);
            this.ctx.strokeStyle = '#c62828';
            this.ctx.lineWidth = 1.5;
            this.ctx.strokeRect(btnX, btnY, btnSize, btnSize);

            // Croix blanche
            this.ctx.strokeStyle = 'white';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(btnX + 4 * scale, btnY + 4 * scale);
            this.ctx.lineTo(btnX + btnSize - 4 * scale, btnY + btnSize - 4 * scale);
            this.ctx.moveTo(btnX + btnSize - 4 * scale, btnY + 4 * scale);
            this.ctx.lineTo(btnX + 4 * scale, btnY + btnSize - 4 * scale);
            this.ctx.stroke();
        }
    }

    drawAnchorsOut(page, screenPos, width, height, scale) {
        const spacing = height / (page.anchorsOut + 1);

        for (let i = 1; i <= page.anchorsOut; i++) {
            // Vérifier si cette ancre a déjà un lien
            const hasLink = this.linkManager.hasLinkFromAnchor(page.id, i);

            // Couleur différente si l'ancre a déjà un lien
            this.ctx.fillStyle = hasLink ? '#1976D2' : '#2196F3';

            this.ctx.beginPath();
            this.ctx.arc(
                screenPos.x + width,
                screenPos.y + spacing * i,
                8 * scale,
                0,
                Math.PI * 2
            );
            this.ctx.fill();

            // Petit indicateur visuel si l'ancre a un lien
            if (hasLink) {
                this.ctx.strokeStyle = '#0D47A1';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            }
        }
    }

    drawControlButtons(screenPos, width, height, scale) {
        const btnSize = 18 * scale;
        const btnX = screenPos.x + width - 30 * scale;

        // Bouton "+"
        const btnYPlus = screenPos.y + height / 2 - 18 * scale;

        this.ctx.fillStyle = '#FF9800';
        this.ctx.fillRect(btnX, btnYPlus, btnSize, btnSize);
        this.ctx.strokeStyle = '#F57C00';
        this.ctx.lineWidth = 1.5;
        this.ctx.strokeRect(btnX, btnYPlus, btnSize, btnSize);

        // Symbole "+"
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 2.5;
        this.ctx.beginPath();
        this.ctx.moveTo(btnX + btnSize / 2, btnYPlus + 4 * scale);
        this.ctx.lineTo(btnX + btnSize / 2, btnYPlus + btnSize - 4 * scale);
        this.ctx.moveTo(btnX + 4 * scale, btnYPlus + btnSize / 2);
        this.ctx.lineTo(btnX + btnSize - 4 * scale, btnYPlus + btnSize / 2);
        this.ctx.stroke();

        // Bouton "-"
        const btnYMinus = screenPos.y + height / 2 + 2 * scale;

        this.ctx.fillStyle = '#9E9E9E';
        this.ctx.fillRect(btnX, btnYMinus, btnSize, btnSize);
        this.ctx.strokeStyle = '#616161';
        this.ctx.lineWidth = 1.5;
        this.ctx.strokeRect(btnX, btnYMinus, btnSize, btnSize);

        // Symbole "-"
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 2.5;
        this.ctx.beginPath();
        this.ctx.moveTo(btnX + 4 * scale, btnYMinus + btnSize / 2);
        this.ctx.lineTo(btnX + btnSize - 4 * scale, btnYMinus + btnSize / 2);
        this.ctx.stroke();
    }
}