import {CardDefinition, cards} from "./card-list.ts";
import {getElement} from "../../utils/dom.ts";
import {renderCardLazy} from "./card-utils.ts";
import {cleanCardName} from "../../utils/sanitization.ts";
import {Filter} from "../../utils/filter.ts";
import {RelicAncient, RelicCharacter, RelicRarity} from "../relics/relic-list.ts";

export interface CardLibraryState {
    rarities: Set<RelicRarity>
    characters: RelicCharacter
    ancients: RelicAncient
    query: string
    matches: Set<String>
}

export class CardLibrary extends Filter<CardDefinition>{
    constructor() {
        super(
            getElement("#card-library"),
            getElement("#card-library-search"),
            cards
        )
    }

    protected createElement(card: CardDefinition) {
        const image = renderCardLazy(card.id);
        const element = document.createElement("div");

        element.classList.add("card-entry");

        element.setAttribute("card-name", cleanCardName(card.id));
        element.appendChild(image);
        return element;
    }
}