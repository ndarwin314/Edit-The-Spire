import {CardDefinition, cards} from "./card-list.ts";
import {getElement} from "../../utils/dom.ts";
import {renderCardLazy} from "./card-utils.ts";
import {cleanCardName} from "../../utils/sanitization.ts";
import {Filter} from "../../utils/filter.ts";

export interface CardLibraryState {
    query: string,
    matches: Set<string>
}

export class CardLibrary extends Filter<CardDefinition>{
    // @ts-ignore
    private readonly element: HTMLElement;
    protected state: CardLibraryState;

    constructor() {
        super(
            getElement("#library-grid"),
            getElement("#card-library-search"),
            cards
        )

        this.element = getElement("#card-library");

        this.state = {
            query: "",
            matches: new Set()
        }

        this.grid.replaceChildren();
        for (const card of cards) {
            this.grid.appendChild(this.createCard(card));
        }

        this.setupSearchFilter();
        //this.onChange();
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