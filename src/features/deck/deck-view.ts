import {cleanCardName, getCardImage, getElement} from "../../utils/utils.ts";
import {Card, type SaveInfo} from "../../app/types.ts";
import {player} from "../../services/tauri.ts";

interface DeckState {
    cards: Card[]
}

export class DeckView {
    private readonly deckPage: HTMLElement;
    private readonly deckSearch: HTMLElement
    private readonly cardGrid: HTMLElement;
    private readonly cardEditor: HTMLElement;
    private readonly state: DeckState;
    constructor() {
        this.cardGrid = getElement("#deck-grid");
        this.deckPage = getElement("#deck-page");
        this.deckSearch = this.deckPage.querySelector(".sort-bar")!;
        this.cardEditor = getElement("#card-editor");
        this.state = {
            cards: []
        };
    }

    init() {

    }

    async load(save: SaveInfo) {
        this.state.cards = await player.getDeck();
    }

    private renderDeck() {

    }

    private createCard(card: Card) {
        const element = document.createElement("div");

        const cardName = cleanCardName(card.id);
        element.classList.add("card-entry");
        element.setAttribute("card-name", cardName);

        const image = document.createElement("img");
        image.src = getCardImage(cardName, card.current_upgrade_level!=0);
        image.addEventListener("click", () => {this.cardEditor.classList.add("active");});
        element.appendChild(image);

        const enchantment = document.createElement("div");
        enchantment.classList.add("enchantment-badge");
        enchantment.setAttribute("enchantment", card.enchantment==undefined ? "none": card.enchantment.id);

        return element;
    }

}