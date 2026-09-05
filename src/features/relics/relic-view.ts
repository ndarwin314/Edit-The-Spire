import type {Relic} from "../../app/types";
import {cleanRelicName, getPlusIcon, getRelicImage, overlayOnClick} from "../../utils/utils.ts";
import {RelicFilters} from "./relic-filters.ts";
import {CharacterState} from "../character/character-view.ts";

export interface RelicViewState {
    relics: Relic[]
    selected_relic: number
    character: string
}

export class RelicView {
    private readonly state: RelicViewState;
    public readonly relicFilters: RelicFilters;
    constructor(
        public readonly container: HTMLElement,
        private readonly library: HTMLElement,
    ) {
        this.state = {
            relics: [],
            selected_relic: -1,
            character: "any"
        }
        this.relicFilters = new RelicFilters(
            (id: string) => RelicView.replaceRelic(this, id),
            this.library);

        const fun: () => void = () => {
            this.library.classList.remove("active");
            this.state.selected_relic = -1;
        };

        const relicClose = this
            .library
            .querySelector<HTMLButtonElement>(".close-button")!;
        relicClose.addEventListener('click', fun);
        this.library.addEventListener("click", event => overlayOnClick(event, fun));
    }

    async load(relics: Relic[], character: string) {
        this.state.relics = relics;
        this.state.character = character;

        this.relicFilters.setCharacter(
            character
                .replace("CHARACTER.", "")
                .toLowerCase()
        );
    }

    save(globalState: CharacterState) {
        let floor = globalState.save_info.floor;
        let relics: Relic[] = [];
        for (const relic of this.state.relics) {
            relics.push({
                id: relic.id,
                floor_added_to_deck: relic.floor_added_to_deck > 0 ? relic.floor_added_to_deck: floor+1
            });
        }

        globalState.relics = relics;
    }

    async render() {
        this.container.replaceChildren();
        let i= 0;
        for (const relic of this.state.relics) {
            this.container.appendChild(
                await this.createRelicElement(relic, i)
            );
            i++;
        }
        this.container.appendChild(await this.createAddRelic(i));
    }

    static async replaceRelic(relicView: RelicView, relicID: string) {
        let index = relicView.state.selected_relic;
        const children = relicView
            .container
            .children;
        const relicContainer = children[index];
        relicContainer.replaceChildren();
        relicContainer.appendChild(await relicView.createRelicImage(relicID));

        let floor = -1;
        let temp: Relic = {
            id: "RELIC." + relicID.toUpperCase(),
            floor_added_to_deck: floor
        };
        if (index==children.length-1) {
            relicView.container.appendChild(await relicView.createAddRelic(index+1));
            relicView.state.relics.push(temp);
        } else {
            floor = relicView.state.relics[index].floor_added_to_deck;
            relicView.state.relics[index] = {
                id: "RELIC." + relicID.toUpperCase(),
                floor_added_to_deck: floor
            };
        }

        relicView.state.selected_relic = -1;
    }

    private createAddRelic(index: number) {
        const addRelic: Relic = {
            id: "RELIC.PLUS_ICON",
            floor_added_to_deck: -1
        }
        return this.createRelicElement(addRelic, index);
    }
    private async createRelicElement(relic: Relic, index: number) {
        let cleanedName = cleanRelicName(relic.id);
        const element = document.createElement("div");

        element.classList.add("item-slot");

        const image = this.createRelicImage(cleanedName);

        element.appendChild(await image);

        element.addEventListener("click",() => this.clickEvent(index));

        return element;
    }

    private async createRelicImage(relicID: string) {
        const image = document.createElement("img");

        image.src = await (relicID==="plus_icon" ? getPlusIcon(): getRelicImage(relicID));
        return image;
    }

    private clickEvent(index: number) {
        this.library.classList.add("active");
        this.state.selected_relic = index;
    }
}