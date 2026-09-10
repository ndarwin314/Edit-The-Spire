import {Card, Enchantment} from "../../app/types.ts";
import {getElement, overlayOnClick} from "../../utils/dom.ts";

const enchantAmounts: Map<string, number> = new Map(
    [
        ["adroit", 3],
        ["nimble", 2],
        ["momentum", 5],
        ["sharp", 2],
        ["swift", 2],
        ["vigorous", 8]
    ]
)

export class EnchantmentEditor {
    private readonly element: HTMLElement;
    private readonly enchantmentGrid: HTMLElement;
    private readonly selectedEnchantment: HTMLImageElement;
    private readonly amountEditor: HTMLElement;
    private readonly state: Enchantment;

    private card: Card | null = null;

    constructor(
        private readonly callback: () => void,
        private readonly afterChange: (card: Card) => void
    ) {
        this.element = getElement("#enchant-selector");
        this.enchantmentGrid = this.element.querySelector(".enchant-grid")!;
        this.selectedEnchantment = this.element.querySelector("#chosen-enchantment")!;
        this.amountEditor = this.element.querySelector(".enchant-amount-box")!;
        this.state = {
            id: undefined,
            amount: -1
        }

        const fun = () => {
            this.close();
        }

        this.element.addEventListener("click", event => overlayOnClick(event, fun));

        const closeButton = this.element.querySelector(".close-button")!;
        closeButton.addEventListener("click", event => overlayOnClick(event, fun));

        const confirmButton = this.element.querySelector(".confirm-button")!;
        confirmButton.addEventListener("click", () => this.confirm());

        this.render();
    }
    setCard(card: Card) {
        this.card = card;
    }

    render() {
        const enchantments = this.enchantmentGrid.children;
        for (const enchantment of enchantments) {
            enchantment.addEventListener("click", () =>
                this.setEnchantment(<HTMLImageElement>enchantment))
        }
    }

    private setEnchantment(element: HTMLImageElement) {
        const enchantment = element.getAttribute("data-value");
        if (enchantment==null) return;

        this.state.id = enchantment;

        if (enchantAmounts.has(enchantment)) {
            this.state.amount = enchantAmounts.get(enchantment)!;
            this.amountEditor.hidden = false;
            this.amountEditor.innerText = String(this.state.amount);
        }

        this.selectedEnchantment.src = element.src;
        this.amountEditor.hidden = !enchantAmounts.has(enchantment);
        this.selectedEnchantment.hidden = false;

    }

    open(card: Card) {
        this.element.classList.add("active");
        this.setCard(card);
    }

    close() {
        this.element.classList.remove("active");
        this.selectedEnchantment.hidden = true;
        this.card = null;
        this.callback();
    }

    confirm() {
        if (this.card==null) return;
        const enchantment = structuredClone(this.state);
        enchantment.id = "ENCHANTMENT." + enchantment.id?.toUpperCase();
        this.card.enchantment = enchantment;
        this.afterChange(this.card);
        this.state.id = undefined;
        this.state.amount = -1;
        this.close();
    }
}