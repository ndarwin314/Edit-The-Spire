import type {Relic} from "../../app/types";
import RelicFilters from "./relic-filters.ts";
import {CharacterState} from "../character/character-view.ts";
import {cleanRelicName} from "../../utils/sanitization.ts";
import {overlayOnClick} from "../../utils/dom.ts";
import {renderRelicElement, renderRelicImage} from "./relic-utils.ts";
import {createTooltipContainer} from "../../utils/render.ts";
import {RelicDefinition, relics} from "./relic-list.ts";

export interface RelicViewState {
    relics: Relic[]
    selected_relic: number
    character: string
}

let relicLookup: Map<string, RelicDefinition> = new Map();
for (const relic of relics) {
    relicLookup.set(cleanRelicName(relic.id), relic)
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
        console.log(this.state.relics)
    }

    async render() {
        this.container.replaceChildren();
        let i= 0;
        for (const relic of this.state.relics) {
            this.container.appendChild(
                await this.createRelic(relic, i)
            );
            i++;
        }
        this.container.appendChild(await this.createAddRelic(i));
    }

    static async replaceRelic(relicView: RelicView, relicID: string) {
        let index = relicView.state.selected_relic;
        const children = relicView.container.children;
        const relicContainer = children[index];
        relicContainer.replaceChildren();

        const cleanedName = cleanRelicName(relicID);
        const image = await renderRelicImage(relicID)

        relicContainer.appendChild(createTooltipContainer(cleanedName, relicLookup.get(cleanedName)!.description, image));

        let floor = -1;
        let temp: Relic = {
            id: relicID.toUpperCase(),
            floor_added_to_deck: floor
        };
        if (index==children.length-1) {
            relicView.container.appendChild(await relicView.createAddRelic(index+1));
            relicView.state.relics.push(temp);
        } else {
            floor = relicView.state.relics[index].floor_added_to_deck;
            relicView.state.relics[index] = {
                id: relicID.toUpperCase(),
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
        return this.createRelic(addRelic, index);
    }
    private async createRelic(relic: Relic, index: number) {
        const image = await renderRelicImage(relic.id)
        const cleanedName = cleanRelicName(relic.id)
        let description = "";
        if (relicLookup.has(cleanedName)) {
            description = relicLookup.get(cleanedName)!.description
        }
        const element = renderRelicElement(relic.id, description, image);

        element.addEventListener("click",() => this.clickEvent(index));

        return element;
    }


    private clickEvent(index: number) {
        this.library.classList.add("active");
        this.state.selected_relic = index;
    }

    reset() {
        this.relicFilters.reset();
    }
}