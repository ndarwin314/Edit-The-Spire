import {cleanCardName, getElement, renderCard} from "../../utils/utils.ts";
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
    // @ts-ignore
    private readonly deckSearch: HTMLElement;
    private readonly cardLibrary: CardLibrary;
    private readonly cardGrid: HTMLElement;
    private readonly deckCount: HTMLElement;
    private readonly cardEditor: CardEditor;
    private readonly state: DeckState;

    constructor() {
        this.cardGrid = getElement("#deck-grid");
        this.deckPage = getElement("#deck-page");
        this.deckCount = this.deckPage.querySelector(".deck-value")!;
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

        this.cardEditor.init()

        const resetButton = this.deckPage.querySelector("#reset-button")!;
        resetButton.addEventListener("click", () => this.resetHelper());

        const libButton = getElement("#card-library-button");
        libButton.addEventListener("click", () => this.cardLibrary.open());
    }

    private resetHelper() {
        this.state.cards = structuredClone(this.state.originalCards);
        this.render();
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
        this.render();
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

        renderCard(<HTMLElement>entry, card)

        entry.setAttribute("card-name", cleanCardName(card.id));
    }


    async load() {
        this.state.cards = await player.getDeck();
        this.state.originalCards = structuredClone(this.state.cards);
    }

    render() {
        this.cardGrid.replaceChildren();
        let i= 0;
        for (const card of this.state.cards) {
            this.cardGrid.appendChild(this.createCard(card));
            i++;
        }
        this.deckCount.innerText = String(this.state.cards.length);
    }

    private createCard(card: Card) {
        const element = document.createElement("div");

        renderCard(element, card);

        element.addEventListener("click", () => this.cardEditor.open(card));

        return element;
    }
}