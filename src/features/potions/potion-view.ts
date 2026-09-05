import type {Potion} from "../../app/types";
import {cleanPotionName, getPlusIcon, getPotionImage, overlayOnClick} from "../../utils/utils.ts";
import {PotionFilters} from "./potion-filters.ts";
import {CharacterState} from "../character/character-view.ts";

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
            this.state.potions[potion.slot_index] = potion.id;
        }
        this.state.potions[max_potions] = "plus_icon";
        this.potionFilters.setCharacter("any");
        this.potionFilters.reset();
    }

    save(globalState: CharacterState) {
        globalState.maxPotions = this.state.max_potions;
        const potions: Potion[] = [];
        for (let i = 0; i < this.state.potions.length; i++) {
            const potion = this.state.potions[i];
            if (potion?.startsWith("POTION.")) {
                potions.push({
                    id: potion,
                    slot_index: i
                });
            }

        }
        globalState.potions = potions;
    }

    async render() {
        await this.potionFilters.init();
        this.container.replaceChildren();
        for (let i = 0; i <= this.state.max_potions; i++) {
            this.container.appendChild(await this.createPotionElement(i));
        }
        const potionClose = this.library.querySelector<HTMLButtonElement>(".close-button")!;
        potionClose.addEventListener('click', () => {this.library.classList.remove("active");});

    }


    static async replacePotion(potionView: PotionView, potionID: string) {
        let index = potionView.state.selected_potion;
        const children = potionView
            .container
            .children;
        const potionContainer = children[index];
        potionContainer.replaceChildren();
        potionContainer.appendChild(await potionView.createPotionImage(potionID));

        potionView.state.potions[index] = "POTION." + potionID.toUpperCase();
        potionView.state.selected_potion = -1;
    }

    private async createPotionElement(index: number) {
        const element = document.createElement("div");

        element.classList.add("item-slot");

        let image_url = placeholder;
        if (this.state.potions[index]!=undefined) {
            image_url = cleanPotionName(this.state.potions[index]);
        }
        const image = await this.createPotionImage(image_url);

        element.addEventListener("click", async () => await this.clickEvent(index));
        element.appendChild(image);
        return element
    }

    private async createPotionImage(potionID: string) {
        const image = document.createElement("img");
        image.src = await (potionID==="plus_icon" ? getPlusIcon(): getPotionImage(potionID));
        return image;
    }

    private async clickPlus(index: number) {
        this.state.potions.push("plus_icon");
        this.state.potions[index] = placeholder;
        this.state.max_potions += 1;
        this.state.selected_potion = index;

        const children = this.container.children;
        const potionContainer = children[index];
        potionContainer.replaceChildren();
        potionContainer.appendChild(await this.createPotionImage(placeholder));

        this.container.appendChild(await this.createPotionElement(index+1));
    }

    private async clickEvent(index: number) {
        const potion = this.state.potions[index];
        if (potion=="plus_icon") {
            await this.clickPlus(index);
        } else {
            this.library.classList.add("active");
            this.state.selected_potion = index;
        }
    }

}