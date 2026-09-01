import {getElement} from "../../utils/utils.ts";

export class CardLibrary {
    private readonly element: HTMLElement;
    constructor() {
        this.element = getElement("#card-library");
    }

    init() {

    }

    open() {
        this.element.classList.add("active");
        this.element.hidden = false;
        const deckPage = getElement<HTMLElement>("#deck-page");
        deckPage.hidden = true;
        deckPage.classList.remove("active");
    }
}