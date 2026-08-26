import type {Potion} from "../../app/types";
import {cleanPotionName, getPlusIcon, getPotionImage} from "../../utils/utils.ts";
import {PotionFilters} from "./potion-filters.ts";

export interface PotionViewState {
    potions: string[]
    selected_potion: number
}

export class PotionView {
    public readonly potionFilters: PotionFilters;
    public readonly state: PotionViewState;
    constructor(
        private readonly container: HTMLElement,
        private readonly library: HTMLElement,
    ) {
        this.state = {
            potions: [],
            selected_potion: -1
        }
        this.potionFilters = new PotionFilters(
            (id: string) => PotionView.replacePotion(this, id),
            this.library);
    }

    render(potions: Potion[], max_potions: number) {
        this.container.replaceChildren();
        this.state.potions = new Array(max_potions+1);
        for (const potion of potions) {
            this.state.potions[potion.slot_index] = cleanPotionName(potion.id);
        }
        this.state.potions[max_potions] = "plus_icon";
        let i;
        for (i = 0; i <= max_potions; i++) {
            this.container.appendChild(this.createPotionElement(i));
        }
        const potionClose = this.library.querySelector<HTMLButtonElement>(".close-button")!;
        potionClose.addEventListener('click', () => {this.library.classList.remove("active");});
    }

    init() {
        this.potionFilters.init();
        const potionClose = this
            .library
            .querySelector<HTMLButtonElement>(".close-button")!;
        potionClose.addEventListener('click', () => {
            this.library.classList.remove("active");
            this.state.selected_potion = -1;
        });
    }

    static replacePotion(potionView: PotionView, potionID: string) {
        let index = potionView.state.selected_potion;
        const children = potionView
            .container
            .children;
        const potionContainer = children[index];
        potionContainer.replaceChildren();
        potionContainer.appendChild(potionView.createPotionImage(potionID));


        if (index==children.length-1) {
            potionView.container.appendChild(potionView.createAddPotion(index+1));
            potionView.state.potions.push(potionID);
        } else {
            potionView.state.potions[index] = potionID;
        }
        potionView.state.selected_potion = -1;
    }

    private createPotionElement(index: number) {
        const element = document.createElement("div");

        element.classList.add("item-slot");

        let image_url = "potion_placeholder";
        if (this.state.potions[index]!=undefined) {
            image_url = this.state.potions[index];
        }
        const image =this.createPotionImage(image_url);

        element.addEventListener("click", () => {
            this.clickEvent(index);
        });
        element.appendChild(image);
        return element
    }

    private createAddPotion(index: number) {
        return this.createPotionElement(index);
    }

    private createPotionImage(potionID: string) {
        const image = document.createElement("img");
        image.src = potionID==="plus_icon" ? getPlusIcon(): getPotionImage(potionID);
        return image;
    }

    private clickEvent(index: number) {
        this.library.classList.add("active");
        this.state.selected_potion = index;
    }

}