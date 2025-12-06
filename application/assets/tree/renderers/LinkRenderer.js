export class LinkRenderer {
    constructor(ctx, viewport) {
        this.ctx = ctx;
        this.viewport = viewport;
    }

    renderAll(links, pages) {
        links.forEach(link => {
            const sourcePage = pages.find(p => p.id === link.sourcePageId);
            const targetPage = pages.find(p => p.id === link.targetPageId);

            if (sourcePage && targetPage) {
                this.renderLink(sourcePage, link.sourceAnchorIndex, targetPage);
            }
        });
    }

    renderLink(sourcePage, anchorIndex, targetPage) {
        const sourcePos = sourcePage.getAnchorOutPosition(anchorIndex);
        const targetPos = targetPage.getAnchorInPosition();

        const screenSource = this.viewport.worldToScreen(sourcePos.x, sourcePos.y);
        const screenTarget = this.viewport.worldToScreen(targetPos.x, targetPos.y);

        // Calculer les points de contrôle pour la courbe de Bézier
        const dx = screenTarget.x - screenSource.x;
        const dy = screenTarget.y - screenSource.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Offset des points de contrôle (ajusté en fonction de la distance)
        const offsetX = Math.min(distance * 0.5, 150);

        // Point de contrôle 1 : à droite de la source
        const cp1x = screenSource.x + offsetX;
        const cp1y = screenSource.y;

        // Point de contrôle 2 : à gauche de la cible
        const cp2x = screenTarget.x - offsetX;
        const cp2y = screenTarget.y;

        // Dessiner la courbe de Bézier
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(screenSource.x, screenSource.y);
        this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, screenTarget.x, screenTarget.y);
        this.ctx.stroke();

        // Dessiner la flèche à l'extrémité
        this.drawArrowOnCurve(screenSource.x, screenSource.y, cp1x, cp1y, cp2x, cp2y, screenTarget.x, screenTarget.y);
    }

    renderTempLink(tempLink) {
        if (!tempLink) return;

        const sourcePos = tempLink.sourcePage.getAnchorOutPosition(tempLink.sourceAnchorIndex);
        const screenSource = this.viewport.worldToScreen(sourcePos.x, sourcePos.y);
        const screenEnd = this.viewport.worldToScreen(tempLink.endX, tempLink.endY);

        // Calculer les points de contrôle
        const dx = screenEnd.x - screenSource.x;
        const dy = screenEnd.y - screenSource.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const offsetX = Math.min(distance * 0.5, 150);

        const cp1x = screenSource.x + offsetX;
        const cp1y = screenSource.y;
        const cp2x = screenEnd.x - offsetX;
        const cp2y = screenEnd.y;

        // Dessiner la courbe en pointillés
        this.ctx.strokeStyle = '#666';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(screenSource.x, screenSource.y);
        this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, screenEnd.x, screenEnd.y);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        // Cercle à la fin
        const scale = this.viewport.getScale();
        this.ctx.fillStyle = '#2196F3';
        this.ctx.beginPath();
        this.ctx.arc(screenEnd.x, screenEnd.y, 8 * scale, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawArrowOnCurve(x0, y0, cp1x, cp1y, cp2x, cp2y, x3, y3) {
        // Calculer l'angle de la tangente à la fin de la courbe
        // La tangente au point final d'une courbe de Bézier cubique est dans la direction (x3 - cp2x, y3 - cp2y)
        const angle = Math.atan2(y3 - cp2y, x3 - cp2x);

        const arrowLength = 12;
        const arrowWidth = 8;

        this.ctx.fillStyle = '#333';
        this.ctx.beginPath();
        this.ctx.moveTo(x3, y3);
        this.ctx.lineTo(
            x3 - arrowLength * Math.cos(angle) + arrowWidth * Math.sin(angle),
            y3 - arrowLength * Math.sin(angle) - arrowWidth * Math.cos(angle)
        );
        this.ctx.lineTo(
            x3 - arrowLength * Math.cos(angle) - arrowWidth * Math.sin(angle),
            y3 - arrowLength * Math.sin(angle) + arrowWidth * Math.cos(angle)
        );
        this.ctx.closePath();
        this.ctx.fill();
    }
}