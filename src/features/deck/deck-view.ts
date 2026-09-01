import {cleanCardName, cleanEnchantmentName, getCardImage, getElement} from "../../utils/utils.ts";
import {Card} from "../../app/types.ts";
import {player} from "../../services/tauri.ts";
import { CardEditor } from "./card-editor.ts";
import {CardLibrary} from "./card-library.ts";

interface DeckState {
    cards: Card[],
    originalCards: Card[],
    index: number
}

export class DeckView {
    private readonly deckPage: HTMLElement;
    private readonly deckSearch: HTMLElement;
    private readonly cardLibrary: CardLibrary;
    private readonly cardGrid: HTMLElement;
    private readonly cardEditor: CardEditor;
    private readonly state: DeckState;
    constructor() {
        this.cardGrid = getElement("#deck-grid");
        this.deckPage = getElement("#deck-page");
        this.deckSearch = this.deckPage.querySelector(".sort-bar")!;

        this.cardEditor = new CardEditor(
            card => this.upgradeCallback(card),
            card => this.removeCallback(card),
            card => this.enchantmentCallback(card)
        );

        this.cardLibrary = new CardLibrary();

        this.state = {
            cards: [],
            originalCards: [],
            index: -1
        };
    }


    init() {
        this.cardEditor.init()

        const resetButton = this.deckPage.querySelector("#reset-button")!;
        resetButton.addEventListener("click", () => this.resetHelper());

        const libButton = getElement("#card-library-button");
        libButton.addEventListener("click", () => this.cardLibrary.open());
    }

    private resetHelper() {
        this.state.cards = structuredClone(this.state.originalCards);
        this.renderDeck();
    }

    private upgradeCallback(card: Card) {
        const index = this.state.cards.indexOf(card);
        if (index === -1) {
            return;
        }

        card.current_upgrade_level =
            card.current_upgrade_level === 1 ? 0 : 1;

        this.updateGrid(card, index);
        this.cardEditor.update(card);
    }

    private removeCallback(card: Card) {
        const index = this.state.cards.indexOf(card);
        if (index === -1) {
            return;
        }

        this.state.cards.splice(index, 1);

        this.cardEditor.close();
        this.renderDeck();
    }

    private enchantmentCallback(card: Card) {
        const index = this.state.cards.indexOf(card);
        if (index === -1) {
            return;
        }
        this.cardEditor.enchantmentSelector.classList.add("active");
        this.cardEditor.suppress();
    }


    private updateGrid(card: Card, index: number) {
        const entry = this.cardGrid.children[index];
        const image = entry.querySelector<HTMLImageElement>(".card-image")!;
        image.src = this.getCardImage(card);
        entry.setAttribute("card-name", cleanCardName(card.id));
    }


    async load() {
        this.state.cards = await player.getDeck();
        this.state.originalCards = structuredClone(this.state.cards);
        this.renderDeck()
    }

    private renderDeck() {
        this.cardGrid.replaceChildren();
        let i= 0;
        for (const card of this.state.cards) {
            this.cardGrid.appendChild(this.createCard(card));
            i++;
        }
    }

    private createCard(card: Card) {
        const element = document.createElement("div");

        const cardName = cleanCardName(card.id);
        element.classList.add("card-entry");
        element.setAttribute("card-name", cardName);

        const image = document.createElement("img");
        image.src = this.getCardImage(card);
        image.classList.add("card-image");
        image.addEventListener("click", () => this.cardEditor.open(card));
        element.appendChild(image);

        const enchantment = document.createElement("div");
        enchantment.classList.add("enchantment-badge");
        
        if (card.enchantment) {
        const enchantmentName = cleanEnchantmentName(card.enchantment.id);
        enchantment.setAttribute("enchantment", enchantmentName);

            if (card.enchantment.amount !== undefined) {
                const badgeValue = document.createElement("span");
                badgeValue.classList.add("badge-value");
                badgeValue.textContent = card.enchantment.amount.toString();
                enchantment.appendChild(badgeValue);
            }
        } else {
            enchantment.setAttribute("enchantment", "none");
        }
        element.appendChild(enchantment);

        return element;
    }


    private getCardImage(card: Card) {
        const cardName = cleanCardName(card.id);
        const upgraded = !(card.current_upgrade_level===undefined || card.current_upgrade_level==0);
        return getCardImage(cardName, upgraded);
    }

}