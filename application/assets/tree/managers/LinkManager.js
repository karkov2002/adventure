import { Link } from '../models/Link.js';

export class LinkManager {
    constructor() {
        this.links = [];
        this.tempLink = null; // Pour le lien en cours de création
    }

    addLink(sourcePageId, sourceAnchorIndex, targetPageId) {
        // Vérifier si un lien existe déjà depuis cette ancre source
        const existsFromAnchor = this.links.some(link =>
            link.sourcePageId === sourcePageId &&
            link.sourceAnchorIndex === sourceAnchorIndex
        );

        if (existsFromAnchor) {
            return null; // Un lien existe déjà depuis cette ancre
        }

        // Vérifier si le lien exact existe déjà (redondant mais par sécurité)
        const exists = this.links.some(link =>
            link.matches(sourcePageId, sourceAnchorIndex, targetPageId)
        );

        if (!exists) {
            const link = new Link(sourcePageId, sourceAnchorIndex, targetPageId);
            this.links.push(link);
            return link;
        }
        return null;
    }

    removeLinksForPage(pageId) {
        this.links = this.links.filter(link => !link.involvesPage(pageId));
    }

    removeLinksForAnchor(pageId, anchorIndex) {
        this.links = this.links.filter(link =>
            !link.isFromAnchor(pageId, anchorIndex)
        );
    }

    removeIncomingLinks(pageId) {
        const initialLength = this.links.length;
        this.links = this.links.filter(link => !link.isToPage(pageId));
        return initialLength !== this.links.length;
    }

    hasIncomingLinks(pageId) {
        return this.links.some(link => link.isToPage(pageId));
    }

    hasLinkFromAnchor(pageId, anchorIndex) {
        return this.links.some(link =>
            link.sourcePageId === pageId &&
            link.sourceAnchorIndex === anchorIndex
        );
    }

    getLinkFromAnchor(pageId, anchorIndex) {
        return this.links.find(link =>
            link.sourcePageId === pageId &&
            link.sourceAnchorIndex === anchorIndex
        );
    }

    startTempLink(page, anchorIndex, x, y) {
        // Vérifier si un lien existe déjà depuis cette ancre
        if (this.hasLinkFromAnchor(page.id, anchorIndex)) {
            return false; // Ne pas permettre de créer un lien temporaire
        }

        this.tempLink = {
            sourcePage: page,
            sourceAnchorIndex: anchorIndex,
            endX: x,
            endY: y
        };
        return true;
    }

    updateTempLink(x, y) {
        if (this.tempLink) {
            this.tempLink.endX = x;
            this.tempLink.endY = y;
        }
    }

    cancelTempLink() {
        this.tempLink = null;
    }

    getTempLink() {
        return this.tempLink;
    }

    getAllLinks() {
        return this.links;
    }
}