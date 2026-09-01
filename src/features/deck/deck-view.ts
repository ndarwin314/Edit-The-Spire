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
        this.updateGrid(card, index);
        this.cardEditor.update(card);
    }


    private updateGrid(card: Card, index: number) {
        const entry = this.cardGrid.children[index];
        entry.replaceChildren();

        DeckView.renderCard(<HTMLElement>entry, card)

        entry.setAttribute("card-name", cleanCardName(card.id));
    }


    async load() {
        this.state.cards = await player.getDeck();
        this.state.originalCards = structuredClone(this.state.cards);
        this.renderDeck();
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

        DeckView.renderCard(element, card);

        element.addEventListener("click", () => this.cardEditor.open(card));

        return element;
    }
x
    static renderCard(element: HTMLElement, card: Card) {
        const cardName = cleanCardName(card.id);
        element.classList.add("card-entry");
        element.setAttribute("card-name", cardName);

        const image = DeckView.makeCardImage(card);
        const enchantment = DeckView.makeEnchantmentBadge(card);

        element.appendChild(image);
        element.appendChild(enchantment);
    }

    static makeEnchantmentBadge(card: Card) {
        const enchantment = document.createElement("div");
        enchantment.classList.add("enchantment-badge");

        if (card.enchantment && card.enchantment.id) {
            const enchantmentName = cleanEnchantmentName(card.enchantment.id);
            enchantment.setAttribute("enchantment", enchantmentName);

            if (card.enchantment.amount != undefined) {
                const badgeValue = document.createElement("span");
                badgeValue.classList.add("badge-value");
                if (card.enchantment.amount > 0) {
                    badgeValue.textContent = card.enchantment.amount.toString();
                }
                enchantment.appendChild(badgeValue);
            }
        } else {
            enchantment.setAttribute("enchantment", "none");
        }
        return enchantment;
    }

    static makeCardImage(card: Card) {
        const image = document.createElement("img");
        image.src = this.getCardURL(card);
        image.classList.add("card-image");

        return image;
    }


    static getCardURL(card: Card) {
        const cardName = cleanCardName(card.id);
        const upgraded = !(card.current_upgrade_level===undefined || card.current_upgrade_level==0);
        return getCardImage(cardName, upgraded);
    }

}