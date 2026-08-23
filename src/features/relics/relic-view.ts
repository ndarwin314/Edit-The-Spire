import type { Relic } from "../../app/types";
import {getRelicImage, cleanRelicName} from "../../utils/utils.ts";

export class RelicView {
    constructor(
        private readonly container: HTMLElement,
        private readonly library: HTMLElement,
    ) {}

    render(relics: Relic[]) {
        this.container.replaceChildren();

        for (const relic of relics) {
            this.container.appendChild(
                this.createRelicElement(relic)
            );
        }
        const relicClose = this.library.querySelector<HTMLButtonElement>(".close-button")!;
        relicClose.addEventListener('click', () => {this.library.classList.remove("active");});

        this.container.appendChild(this.createAddButton());
    }

    private createRelicElement(relic: Relic) {
        const element = document.createElement("div");

        element.classList.add("item-slot");

        const image = document.createElement("img");
        image.src = getRelicImage(cleanRelicName(relic.id));

        element.appendChild(image);

        element.addEventListener("click", () => {
            this.library.classList.add("active");
        });

        return element;
    }

    private createAddButton() {
        const plusRelic = document.createElement("div");
        plusRelic.classList.add("item-slot");
        plusRelic.id = "plus-relic"
        const image = document.createElement("img");
        image.src = "/src/assets/general/plus_icon.png";
        plusRelic.appendChild(image);
        plusRelic.addEventListener("click", (() => {this.container.classList.add("active")}))
        return plusRelic;
    }
}