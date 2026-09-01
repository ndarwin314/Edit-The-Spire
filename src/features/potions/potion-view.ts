import type {Potion} from "../../app/types";
import {cleanPotionName, getPlusIcon, getPotionImage, overlayOnClick} from "../../utils/utils.ts";
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

    static replacePotion(potionView: PotionView, potionID: string) {
        let index = potionView.state.selected_potion;
        const children = potionView
            .container
            .children;
        const potionContainer = children[index];
        potionContainer.replaceChildren();
        potionContainer.appendChild(potionView.createPotionImage(potionID));

        if (index==children.length-1) {
            potionView.state.potions.push("plus_icon");
            potionView.container.appendChild(potionView.createPotionElement(index+1));
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


        // TODO: Separate out the render code and the code that initializes state
        // make it so if you click on the plus, it just adds another slot, not opening menu

        let fun = index!=this.state.potions.length-1 ?
            () => this.clickEvent(index) :
            () => this.clickEvent(index)
        ;
        element.addEventListener("click", fun);
        element.appendChild(image);
        return element
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