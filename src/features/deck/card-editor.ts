import { Card } from "../../app/types.ts";
import { cleanCardName, getCardImage, getElement } from "../../utils/utils.ts";

export class CardEditor {
    private readonly element: HTMLElement;
    private readonly preview: HTMLImageElement;
    public readonly enchantmentSelector: HTMLElement;

    private card: Card | null = null;

    constructor(
        private onUpgrade: (card: Card) => void,
        private onRemove: (card: Card) => void,
        private onEnchant: (card: Card) => void,
    )
    {
        this.element = getElement("#card-editor");
        this.preview = this.element.querySelector<HTMLImageElement>("#preview-card")!;
        this.enchantmentSelector = getElement("#enchant-selector");
    }

    init() {
        this.element.addEventListener("click", event => {
            if (event.target === this.element) {
                this.close();
            }
        });

        const closeButton =
            this.element.querySelector<HTMLButtonElement>(".close-button")!;

        closeButton.addEventListener("click", () => this.close());

        const upgradeButton =
            this.element.querySelector<HTMLButtonElement>("#upgrade")!;

        upgradeButton.addEventListener("click", () =>
            this.onUpgrade(this.card!)
        );

        const removeButton =
            this.element.querySelector<HTMLButtonElement>("#remove")!;

        removeButton.addEventListener("click", () =>
            this.onRemove(this.card!)
        );

        const enchantButton =
            this.element.querySelector<HTMLButtonElement>("#enchant")!;

        enchantButton.addEventListener("click", () =>
            this.onEnchant(this.card!)
        )
    }

    open(card: Card) {
        this.card = card;

        this.preview.src = this.getCardImage(card);
        this.element.classList.add("active");
    }

    update(card: Card) {
        this.card = card;
        this.preview.src = this.getCardImage(card);
    }

    suppress() {
        this.element.classList.remove("active");
    }

    close() {
        this.card = null;
        this.element.classList.remove("active");
    }

    private getCardImage(card: Card) {
        const cardName = cleanCardName(card.id);
        const upgraded =
            card.current_upgrade_level !== undefined &&
            card.current_upgrade_level !== 0;

        return getCardImage(cardName, upgraded);
    }
}