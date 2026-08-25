import type { Potion } from "../../app/types";
import {cleanPotionName, getPotionImage} from "../../utils/utils.ts";

export class PotionView {
    constructor(
        private readonly container: HTMLElement,
        private readonly library: HTMLElement,
    ) {}

    render(potions: Potion[], max_potions: number) {
        this.container.replaceChildren();
        const potionMap = new Map<number, string>();
        for (const potion of potions) {
            potionMap.set(potion.slot_index, cleanPotionName(potion.id));
        }
        for (let i = 0; i < max_potions; i++) {
            this.container.appendChild(this.createPotionElement(i, potionMap));
        }
        const potionClose = this.library.querySelector<HTMLButtonElement>(".close-button")!;
        potionClose.addEventListener('click', () => {this.library.classList.remove("active");});
        this.container.appendChild(this.createAddButton());
    }

    private createPotionElement(index: number, potionMap: Map<number, string>) {
        const element = document.createElement("div");

        element.classList.add("item-slot");

        const image = document.createElement("img");
        let image_url = "potion_placeholder";
        if (potionMap.has(index)) {
            image_url = <string>potionMap.get(index);
        }
        image.src = getPotionImage(image_url);

        element.addEventListener("click", () => {
            this.library.classList.add("active");
        });
        element.appendChild(image);
        return element
    }

    private createAddButton() {
        const plusPotion = document.createElement("div");
        plusPotion.classList.add("item-slot");
        plusPotion.id = "plus-potion"
        const image = document.createElement("img");
        image.src = "/src/assets/general/plus_icon.png";
        plusPotion.appendChild(image);
        plusPotion.addEventListener("click", (() => {this.library.classList.add("active");}));
        return plusPotion;
    }
}