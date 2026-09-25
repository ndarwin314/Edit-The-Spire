import { Card } from "../../app/types.ts";
import {EnchantmentEditor} from "./enchantment-editor.ts";
import {getElement, overlayOnClick} from "../../utils/dom.ts";
import {renderCard, renderCardLazy} from "./card-utils.ts";

export class CardEditor {
    private readonly element: HTMLElement;
    private readonly preview: HTMLImageElement;
    private readonly enchantmentEditor: EnchantmentEditor;

    private card: Card | null = null;

    constructor(
        private onUpgrade: (card: Card) => Promise<void>,
        private onRemove: (card: Card) => Promise<void>,
        private onEnchant: (card: Card) => Promise<void>,
        private onCopy: (card: Card) => Promise<void>,
    )
    {
        this.element = getElement("#card-editor");
        this.preview = this.element.querySelector<HTMLImageElement>("#preview-card")!;
        this.initEventListeners();

        this.enchantmentEditor = new EnchantmentEditor(
            () => this.reveal(),
            async card => await this.onEnchant(card)
        );


        this.preview.replaceChildren();
    }

    private initEventListeners() {
        this.element.addEventListener("click", event =>
            overlayOnClick(event, () => this.close()));

        const closeButton =
            this.element.querySelector<HTMLButtonElement>(".close-button")!;

        closeButton.addEventListener("click", () => this.close());

        const upgradeButton =
            this.element.querySelector<HTMLButtonElement>("#upgrade")!;

        upgradeButton.addEventListener("click", async () => {
                await this.onUpgrade(this.card!)
            }
        );

        const removeButton =
            this.element.querySelector<HTMLButtonElement>("#remove")!;

        removeButton.addEventListener("click", async () =>
            await this.onRemove(this.card!)
        );

        const copyButton =
            this.element.querySelector<HTMLButtonElement>("#add-copy")!;

        copyButton.addEventListener("click", async () =>
            await this.onCopy(this.card!)
        );

        const enchantButton =
            this.element.querySelector<HTMLButtonElement>("#enchant")!;

        enchantButton.addEventListener("click", () =>
            {
                this.enchantmentEditor.open(this.card!);
                this.suppress();
            }
        )
    }

    async open(card: Card) {
        this.card = card;

        this.element.classList.add("active");
        await this.update(card);
    }

    async update(card: Card) {
        this.preview.replaceChildren();
        const image = renderCardLazy(card.id, card.current_upgrade_level==1);
        renderCard(this.preview, card, image);
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