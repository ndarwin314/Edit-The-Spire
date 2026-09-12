import type {Potion} from "../../app/types";
import PotionFilters from "./potion-filters.ts";
import {CharacterState} from "../character/character-view.ts";
import {overlayOnClick} from "../../utils/dom.ts";
import {renderPotionElement, renderPotionImage} from "./potion-utils.ts";
import {placeholder} from "../../utils/image.ts";


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

    async load(potions: Potion[], max_potions: number) {
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
        potionContainer.appendChild(await renderPotionImage(potionID));

        potionView.state.potions[index] = "POTION." + potionID.toUpperCase();
        potionView.state.selected_potion = -1;
    }

    private async createPotionElement(index: number) {
        let potion = this.state.potions[index];
        if (potion == undefined) {
            potion = placeholder;
        }
        const image = await renderPotionImage(potion);
        const element = renderPotionElement(potion, image);
        element.addEventListener("click", async () => await this.clickEvent(index));

        return element
    }


    private async clickPlus(index: number) {
        this.state.potions.push("plus_icon");
        this.state.potions[index] = placeholder;
        this.state.max_potions += 1;
        this.state.selected_potion = index;

        const children = this.container.children;
        const potionContainer = children[index];
        potionContainer.replaceChildren();
        potionContainer.appendChild(await renderPotionImage(placeholder));

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