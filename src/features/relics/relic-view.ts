import type {Relic} from "../../app/types";
import {cleanRelicName, getPlusIcon, getRelicImage, overlayOnClick} from "../../utils/utils.ts";
import {RelicFilters} from "./relic-filters.ts";

export interface RelicViewState {
    relics: Relic[]
    selected_relic: number
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
            selected_relic: -1
        }
        this.relicFilters = new RelicFilters(
            (id: string) => RelicView.replaceRelic(this, id),
            this.library);
    }

    init() {
        const fun: () => void = () => {
            this.library.classList.remove("active");
            this.state.selected_relic = -1;
        };
        this.relicFilters.init();
        const relicClose = this
            .library
            .querySelector<HTMLButtonElement>(".close-button")!;
        relicClose.addEventListener('click', fun);
        this.library.addEventListener("click", event => overlayOnClick(event, fun));

    }

    render(relics: Relic[]) {
        this.state.relics = relics;

        this.container.replaceChildren();
        let i=0;
        for (const relic of relics) {
            this.container.appendChild(
                this.createRelicElement(relic, i)
            );
            i++;
        }
        this.container.appendChild(this.createAddRelic(i));

    }

    static replaceRelic(relicView: RelicView, relicID: string) {
        let index = relicView.state.selected_relic;
        const children = relicView
            .container
            .children;
        const relicContainer = children[index];
        relicContainer.replaceChildren();
        relicContainer.appendChild(relicView.createRelicImage(relicID));

        let floor = -1;
        let temp: Relic = {
            id: "RELIC." + relicID.toUpperCase(),
            floor_added_to_deck: floor
        };
        if (index==children.length-1) {
            relicView.container.appendChild(relicView.createAddRelic(index+1));
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
    private createRelicElement(relic: Relic, index: number) {
        let cleanedName = cleanRelicName(relic.id);
        const element = document.createElement("div");

        element.classList.add("item-slot");

        const image = this.createRelicImage(cleanedName);

        element.appendChild(image);

        element.addEventListener("click",() => this.clickEvent(index));

        return element;
    }

    private createRelicImage(relicID: string) {
        const image = document.createElement("img");

        image.src = relicID==="plus_icon" ? getPlusIcon(): getRelicImage(relicID);
        return image;
    }

    private clickEvent(index: number) {
        this.library.classList.add("active");
        this.state.selected_relic = index;
    }
}