export class TitleEditor {
    constructor(viewport) {
        this.viewport = viewport;
        this.editingPage = null;
        this.titleInput = null;
    }

    startEditing(page, onComplete) {
        if (this.titleInput) {
            this.titleInput.remove();
        }

        this.editingPage = page;

        this.titleInput = document.createElement('input');
        this.titleInput.type = 'text';
        this.titleInput.id = 'page-title-input';
        this.titleInput.value = page.title;

        const screenPos = this.viewport.worldToScreen(page.x, page.y);
        const scale = this.viewport.getScale();

        this.titleInput.style.left = `${screenPos.x + 10}px`;
        this.titleInput.style.top = `${screenPos.y + 10}px`;
        this.titleInput.style.width = `${(page.width - 20) * scale}px`;
        this.titleInput.style.fontSize = `${14 * scale}px`;

        document.body.appendChild(this.titleInput);
        this.titleInput.focus();
        this.titleInput.select();

        const stopEditing = () => {
            if (this.titleInput && this.editingPage) {
                this.editingPage.title = this.titleInput.value || this.editingPage.title;
                this.titleInput.remove();
                this.titleInput = null;
                this.editingPage = null;
                onComplete();
            }
        };

        this.titleInput.addEventListener('blur', stopEditing);
        this.titleInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                stopEditing();
            } else if (e.key === 'Escape') {
                this.titleInput.value = page.title;
                stopEditing();
            }
        });
    }

    getEditingPage() {
        return this.editingPage;
    }
}