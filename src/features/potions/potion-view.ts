import type {Potion} from "../../app/types";
import {cleanPotionName, getPlusIcon, getPotionImage, overlayOnClick} from "../../utils/utils.ts";
import {PotionFilters} from "./potion-filters.ts";

const placeholder = "potion_placeholder";

export interface PotionViewState {
    potions: string[]
    max_potions: number
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
            max_potions: -1,
            selected_potion: -1
        }
        this.potionFilters = new PotionFilters(
            (id: string) => PotionView.replacePotion(this, id),
            this.library);

        const fun: () => void = () => {
            this.library.classList.remove("active");
            this.state.selected_potion = -1;
        };

        const potionClose = this
            .library
            .querySelector<HTMLButtonElement>(".close-button")!;
        potionClose.addEventListener('click', fun);
        this.library.addEventListener("click", event => overlayOnClick(event, fun));
    }

    load(potions: Potion[], max_potions: number) {
        this.state.potions = new Array(max_potions+1);
        this.state.max_potions = max_potions;
        for (const potion of potions) {
            this.state.potions[potion.slot_index] = cleanPotionName(potion.id);
        }
        this.state.potions[max_potions] = "plus_icon";
        this.potionFilters.setCharacter("any");
        this.potionFilters.reset();

    }

    render() {
        this.container.replaceChildren();
        for (let i = 0; i <= this.state.max_potions; i++) {
            this.container.appendChild(this.createPotionElement(i));
        }
        const potionClose = this.library.querySelector<HTMLButtonElement>(".close-button")!;
        potionClose.addEventListener('click', () => {this.library.classList.remove("active");});
    }


    static replacePotion(potionView: PotionView, potionID: string) {
        let index = potionView.state.selected_potion;
        const children = potionView
            .container
            .children;
        const potionContainer = children[index];
        potionContainer.replaceChildren();
        potionContainer.appendChild(potionView.createPotionImage(potionID));

        potionView.state.potions[index] = potionID;
        potionView.state.selected_potion = -1;
    }

    private createPotionElement(index: number) {
        const element = document.createElement("div");

        element.classList.add("item-slot");

        let image_url = placeholder;
        if (this.state.potions[index]!=undefined) {
            image_url = this.state.potions[index];
        }
        const image = this.createPotionImage(image_url);

        element.addEventListener("click", () => this.clickEvent(index));
        element.appendChild(image);
        return element
    }

    private createPotionImage(potionID: string) {
        const image = document.createElement("img");
        image.src = potionID==="plus_icon" ? getPlusIcon(): getPotionImage(potionID);
        return image;
    }

    private clickPlus(index: number) {
        this.state.potions.push("plus_icon");
        this.state.potions[index] = placeholder;
        this.state.max_potions += 1;
        this.state.selected_potion = index;

        const children = this.container.children;
        const potionContainer = children[index];
        potionContainer.replaceChildren();
        potionContainer.appendChild(this.createPotionImage(placeholder));

        this.container.appendChild(this.createPotionElement(index+1));
    }

    private clickEvent(index: number) {
        const potion = this.state.potions[index];
        if (potion=="plus_icon") {
            this.clickPlus(index);
        } else {
            this.library.classList.add("active");
            this.state.selected_potion = index;
        }
    }



}