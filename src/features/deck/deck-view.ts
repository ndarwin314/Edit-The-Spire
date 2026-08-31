import {cleanCardName, cleanEnchantmentName, getCardImage, getElement, overlayOnClick} from "../../utils/utils.ts";
import {Card, type SaveInfo} from "../../app/types.ts";
import {player} from "../../services/tauri.ts";

interface DeckState {
    cards: Card[],
    index: number
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
            cards: [],
            index: -1
        };
    }


    init() {
        this.cardEditor.addEventListener("click", event =>
            overlayOnClick(event, () => this.cardEditor.classList.remove("active"))
        );

        const upgradeCard = this.cardEditor.querySelector<HTMLButtonElement>("#upgrade")!;
        upgradeCard.addEventListener("click", () => this.upgradeHelper());

        const removeCard = this.cardEditor.querySelector<HTMLButtonElement>("#remove")!;
        removeCard.addEventListener("click", () => this.removeHelper());
    }

    private upgradeHelper() {
        const newCard = this.currentCard();
        if (newCard.current_upgrade_level==1) {
            newCard.current_upgrade_level=0;
        } else {
            newCard.current_upgrade_level=1;
        }
        this.updateGrid(newCard, this.state.index);
        this.updatePreview();
    }

    private removeHelper() {
        const newCard = this.currentCard();
        this.state.cards.splice(this.state.index, 1);
        this.cardEditor.classList.remove("active");
        this.renderDeck();
    }

    private currentCard() {
        return this.state.cards[this.state.index];
    }

    private updateGrid(card: Card, index: number) {
        const entry = this.cardGrid.children[index];
        const image = entry.querySelector<HTMLImageElement>(".card-image")!;
        image.src = this.getCardImage(card);
        entry.setAttribute("card-name", cleanCardName(card.id));
    }


    async load(save: SaveInfo) {
        this.state.cards = await player.getDeck();
        this.renderDeck()
    }

    private renderDeck() {
        this.cardGrid.replaceChildren();
        let i= 0;
        for (const card of this.state.cards) {
            this.cardGrid.appendChild(this.createCard(card, i));
            i++;
        }
    }

    private createCard(card: Card, index: number) {
        const element = document.createElement("div");

        const cardName = cleanCardName(card.id);
        element.classList.add("card-entry");
        element.setAttribute("card-name", cardName);

        const image = document.createElement("img");
        image.src = this.getCardImage(card);
        image.classList.add("card-image");
        image.addEventListener("click", () => this.clickCard(index));
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

    private clickCard(index: number) {
        this.cardEditor.classList.add("active");
        this.state.index = index;
        this.updatePreview();
    }

    private updatePreview() {
        const index = this.state.index;
        const image = this.cardEditor.querySelector<HTMLImageElement>("#preview-card")!;
        const card = this.state.cards[index];
        image.src = this.getCardImage(card);
    }

    private getCardImage(card: Card) {
        const cardName = cleanCardName(card.id);
        const upgraded = !(card.current_upgrade_level===undefined || card.current_upgrade_level==0);
        return getCardImage(cardName, upgraded);
    }

}