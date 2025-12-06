import { Page } from '../models/Page.js';

export class PageManager {
    constructor(idGenerator) {
        this.pages = [];
        this.pageCounter = 0;
        this.nextX = 200;
        this.nextY = 150;
        this.idGenerator = idGenerator;
    }

    addPage() {
        this.pageCounter++;
        const page = new Page(
            parseInt(this.idGenerator.generate(), 10),
            this.nextX,
            this.nextY,
            `Page #${this.pageCounter}`,
            this.pageCounter
        );
        this.pages.push(page);

        this.nextX += 30;
        this.nextY += 30;

        return page;
    }

    removePage(pageId) {
        const index = this.pages.findIndex(p => p.id === pageId);
        if (index !== -1) {
            this.pages.splice(index, 1);
            this.updatePageNumbers();
            return true;
        }
        return false;
    }

    updatePageNumbers() {
        this.pages.forEach((page, index) => {
            const oldNumber = page.pageNumber;
            page.pageNumber = index + 1;
            if (page.title === `Page #${oldNumber}`) {
                page.title = `Page #${page.pageNumber}`;
            }
        });
        this.pageCounter = this.pages.length;
    }

    getPageById(id) {
        return this.pages.find(p => p.id === id);
    }

    getPageAt(x, y) {
        for (let i = this.pages.length - 1; i >= 0; i--) {
            if (this.pages[i].contains(x, y)) {
                return this.pages[i];
            }
        }
        return null;
    }

    bringToFront(page) {
        const index = this.pages.indexOf(page);
        if (index !== -1) {
            this.pages.splice(index, 1);
            this.pages.push(page);
        }
    }

    getAllPages() {
        return this.pages;
    }
}