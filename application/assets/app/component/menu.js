
class MenuComponent {
    constructor() {
        this.navigationItemsSelector = '#navbarNav .nav-item';
        this.navigationItemsEls = [];
    }

    init() {
        this.initNavigationItems();
        this.displayCurrentPageSelected();
    }

    initNavigationItems() {
        this.navigationItemsEls = document.querySelectorAll(this.navigationItemsSelector);
    }

    displayCurrentPageSelected() {
        this.navigationItemsEls.forEach((el) => {
            const itemUrl = el.querySelector('a')?.getAttribute('href');

            console.log(itemUrl);
            console.log(window.location.pathname == itemUrl);

            if (!itemUrl) {
                return;
            }

            if (window.location.pathname == itemUrl) {
                el.querySelector('a').classList.add('active');
            }
        });
    }
}

export default MenuComponent;
