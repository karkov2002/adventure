export class Link {
    constructor(sourcePageId, sourceAnchorIndex, targetPageId) {
        this.sourcePageId = sourcePageId;
        this.sourceAnchorIndex = sourceAnchorIndex;
        this.targetPageId = targetPageId;
    }

    involvesPage(pageId) {
        return this.sourcePageId === pageId || this.targetPageId === pageId;
    }

    isFromAnchor(pageId, anchorIndex) {
        return this.sourcePageId === pageId && this.sourceAnchorIndex === anchorIndex;
    }

    isToPage(pageId) {
        return this.targetPageId === pageId;
    }

    matches(sourcePageId, sourceAnchorIndex, targetPageId) {
        return this.sourcePageId === sourcePageId &&
            this.sourceAnchorIndex === sourceAnchorIndex &&
            this.targetPageId === targetPageId;
    }
}