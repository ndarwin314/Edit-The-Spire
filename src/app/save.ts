
import {showPage, showTab} from "./navigation.ts";
import {getElement, overlayOnClick} from "../utils/dom.ts";

export class SaveManager {
    private readonly saveButton: HTMLButtonElement;
    private readonly saveScreen: HTMLElement;

    constructor(
        private readonly saveFunction: () => Promise<void>,
        private readonly resetFunction: () => void
    ) {
        this.saveButton = getElement(".save-button");
        this.saveScreen = getElement("#save-changes-popup");

        this.saveButton.addEventListener("click", () => this.toggle());

        this.saveScreen.addEventListener("click",
                event => overlayOnClick(event, () => this.continue()));

        const continueButton = this.saveScreen.querySelector(".continue-editing")!;
        continueButton.addEventListener("click", () => this.continue());

        const discardButton = this.saveScreen.querySelector(".discard-changes")!;
        discardButton.addEventListener("click", () => this.discard());

        const acceptButton = this.saveScreen.querySelector(".save-changes")!;
        acceptButton.addEventListener("click", async () => await this.accept());
    }

    private toggle() {
        this.saveScreen.classList.toggle("active")
    }

    private continue() {
        this.saveScreen.classList.remove("active");
    }

    private discard() {
        this.saveScreen.classList.remove("active");
        this.resetFunction();
        showTab("stats");
        showPage("saveSelector");
    }

    private async accept() {
        this.saveScreen.classList.remove("active");
        await this.saveFunction();
        this.resetFunction();
        showTab("stats");
        showPage("saveSelector");
    }
}