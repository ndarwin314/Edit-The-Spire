import { getElement } from "../../utils/utils.ts";

export class RelicFilters {
    private readonly allFilters: NodeListOf<HTMLButtonElement>;
    private readonly rarityFilters: NodeListOf<HTMLButtonElement>;
    private readonly characterFilters: NodeListOf<HTMLButtonElement>;
    private readonly ancientFilters: NodeListOf<HTMLButtonElement>;

    constructor() {
        const library = getElement<HTMLElement>("#relic-library");

        this.allFilters = library.querySelectorAll<HTMLButtonElement>(".filter-chip");

        this.rarityFilters = library
            .querySelector("#rarity-filters")!
            .querySelectorAll<HTMLButtonElement>(".filter-chip");

        this.characterFilters = library
            .querySelector("#character-filters")!
            .querySelectorAll<HTMLButtonElement>(".filter-chip");

        this.ancientFilters = library
            .querySelector("#ancient-filters")!
            .querySelectorAll<HTMLButtonElement>(".filter-chip");
    }

    init() {
        this.setupSimpleFilters(this.rarityFilters);
        this.setupSimpleFilters(this.ancientFilters);
        this.setupCharacterFilters();
    }

    private setupSimpleFilters(
        filters: NodeListOf<HTMLButtonElement>
    ) {
        filters.forEach(button => {
            button.addEventListener("click", () => {
                this.toggle(button);
            });
        });
    }

    private setupCharacterFilters() {
        this.characterFilters.forEach(button => {
            button.addEventListener("click", () => {
                const value = button.dataset.value;

                if (value === "any") {
                    this.selectAnyCharacter();
                } else {
                    this.toggle(button);

                    if (button.classList.contains("active")) {
                        this.disableAnyCharacter();
                    }
                }
            });
        });
    }

    private selectAnyCharacter() {
        this.characterFilters.forEach(button => {
            const isAny = button.dataset.value === "any";

            button.classList.toggle("active", isAny);
            button.setAttribute("aria-pressed", String(isAny));
        });
    }

    private disableAnyCharacter() {
        const anyButton = Array.from(this.characterFilters)
            .find(button => button.dataset.value === "any");

        if (!anyButton) {
            return;
        }

        anyButton.classList.remove("active");
        anyButton.setAttribute("aria-pressed", "false");
    }

    private toggle(button: HTMLButtonElement) {
        const active = button.classList.toggle("active");

        button.setAttribute(
            "aria-pressed",
            String(active)
        );
    }

    setCharacter(character: string) {
        this.characterFilters.forEach(button => {
            const active = button.dataset.value === character;

            button.classList.toggle("active", active);
            button.setAttribute(
                "aria-pressed",
                String(active)
            );
        });
    }

    reset() {
        this.allFilters.forEach(button => {
            button.classList.remove("active");
            button.setAttribute("aria-pressed", "false");
        });
    }
}