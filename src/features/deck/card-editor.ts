import { Card } from "../../app/types.ts";
import {getElement, overlayOnClick, renderCard} from "../../utils/utils.ts";
import {EnchantmentEditor} from "./enchantment-editor.ts";

export class CardEditor {
    private readonly element: HTMLElement;
    private readonly preview: HTMLImageElement;
    private readonly enchantmentEditor: EnchantmentEditor;

    private card: Card | null = null;

    constructor(
        private onUpgrade: (card: Card) => void,
        private onRemove: (card: Card) => void,
        private onEnchant: (card: Card) => void,
    )
    {
        this.element = getElement("#card-editor");
        this.preview = this.element.querySelector<HTMLImageElement>("#preview-card")!;

        this.enchantmentEditor = new EnchantmentEditor(
            () => this.reveal(),
            card => this.onEnchant(card)
        );
    }

    init() {
        this.element.addEventListener("click", event =>
            overlayOnClick(event, () => this.close()));

        const closeButton =
            this.element.querySelector<HTMLButtonElement>(".close-button")!;

        closeButton.addEventListener("click", () => this.close());

        const upgradeButton =
            this.element.querySelector<HTMLButtonElement>("#upgrade")!;

        upgradeButton.addEventListener("click", () => {
                this.onUpgrade(this.card!)
            }
        );

        const removeButton =
            this.element.querySelector<HTMLButtonElement>("#remove")!;

        removeButton.addEventListener("click", () =>
            this.onRemove(this.card!)
        );

        const enchantButton =
            this.element.querySelector<HTMLButtonElement>("#enchant")!;

        enchantButton.addEventListener("click", () =>
            {
                this.enchantmentEditor.open(this.card!);
                this.suppress();
            }
        )

        this.enchantmentEditor.init();
        this.preview.replaceChildren();
    }


    open(card: Card) {
        this.card = card;

        this.element.classList.add("active");
        this.update(card);
    }

    update(card: Card) {
        this.preview.replaceChildren();
        renderCard(this.preview, card);
    }

    suppress() {
        this.element.classList.remove("active");
    }

    reveal() {
        this.element.classList.add("active");
    }

    close() {
        this.card = null;
        this.element.classList.remove("active");
    }

}