import {getElement, getElements} from "../utils/dom.ts";

const pages = {
    startup: getElement<HTMLElement>("#startup-screen-page"),
    saveSelector: getElement<HTMLElement>("#save-selector-page"),
    character: getElement<HTMLElement>("#char-stats-inventory-page"),
} as const;

export type Page = keyof typeof pages;

export function showPage(page: Page) {
    for (const [name, element] of Object.entries(pages)) {
        element.hidden = name !== page;
    }
}

export function initNavigation() {
    initTabs();
    initBackButtons();
}

const tabs = {
    stats: {
        button: getElement<HTMLButtonElement>("#stat-tab"),
        page: getElement<HTMLElement>("#inventory-page"),
    },
    deck: {
        button: getElement<HTMLButtonElement>("#deck-tab"),
        page: getElement<HTMLElement>("#deck-page"),
    },
    //map: {
    //    button: getElement<HTMLButtonElement>("#map-tab"),
    //    page: getElement<HTMLElement>("#map-page"),
    //},
    card: {
        button: getElement<HTMLButtonElement>("#card-tab"),
        page: getElement<HTMLElement>("#card-library")
    }
};

export function showTab(name: keyof typeof tabs) {
    for (const [tabName, tab] of Object.entries(tabs)) {
        const active = tabName === name;

        tab.page.hidden = !active;
        tab.button.classList.toggle("active", active);
    }
}

function initTabs() {


    for (const [name, tab] of Object.entries(tabs)) {
        tab.button.addEventListener("click", () => showTab(name as keyof typeof tabs));
    }

    showTab("stats");
}

function initBackButtons() {
    const backButtons = getElements<HTMLButtonElement>(".back-button");
    backButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const section = button.closest("section")!;
            let prev: Page;
            switch (section.id) {
                case "save-selector-page":
                    prev = "startup";
                    break;
                default:
                    prev = "saveSelector";
            }
            showPage(prev);
        });
    });
}