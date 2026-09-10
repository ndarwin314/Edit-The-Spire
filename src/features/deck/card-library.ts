import {CardDefinition, cards} from "./card-list.ts";
import {getElement} from "../../utils/dom.ts";
import {renderCardLazy} from "./card-utils.ts";
import {cleanCardName} from "../../utils/sanitization.ts";

export class CardLibrary {
    private readonly element: HTMLElement;
    private readonly grid: HTMLElement
    constructor() {
        this.element = getElement("#card-library");
        this.grid = getElement("#library-grid");

        this.grid.replaceChildren();
        for (const card of cards) {
            this.grid.appendChild(this.createCard(card));
        }
    }

    private createCard(card: CardDefinition) {
        const image = renderCardLazy(card.id);
        const element = document.createElement("div");

        element.classList.add("card-entry");

        element.setAttribute("card-name", cleanCardName(card.id));
        element.appendChild(image);
        return element;
    }
    
}