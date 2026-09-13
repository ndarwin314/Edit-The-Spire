import Fuse from "fuse.js";
import {alphaSanitizer} from "./sanitization.ts";
import {RelicAncient, RelicCharacter, RelicRarity} from "../features/relics/relic-list.ts";
import {PotionCharacter, PotionRarity} from "../features/potions/potion-list.ts";

export interface FilterState {
    rarities: Set<RelicRarity>
    characters: RelicCharacter
    query: string
    matches: Set<String>
}

export interface Definition {
    name: string
    id: string
}

export class Filter<T extends Definition> {
    protected readonly grid: HTMLElement;
    protected readonly allFilters: NodeListOf<HTMLButtonElement>;
    protected readonly rarityFilters: NodeListOf<HTMLButtonElement>;
    protected readonly characterFilters: NodeListOf<HTMLButtonElement>;

    protected readonly fuse: Fuse<T>;
    protected state!: FilterState;

    constructor(
        protected readonly library: HTMLElement,
        protected searchBar: HTMLElement,
        protected readonly elements: T[],

    ) {
        this.fuse = new Fuse(elements, {
            keys: ['name'],
            includeScore: true,
            threshold: 0.2
        });

        this.state = {
            rarities: new Set(),
            characters: "any",
            query: "",
            matches: new Set()
        }


        this.grid = library.querySelector(".item-grid")!;

        this.allFilters = library.querySelectorAll<HTMLButtonElement>(".filter-chip");
        this.rarityFilters = library
            .querySelector(".rarity-filter")!
            .querySelectorAll<HTMLButtonElement>(".filter-chip");

        this.characterFilters = library
            .querySelector(".character-filter")!
            .querySelectorAll<HTMLButtonElement>(".filter-chip");


        this.setupFilters(this.rarityFilters, button => this.rarityClick(button));
        this.setupFilters(this.characterFilters, button => this.characterClick(button));
        this.setupSearchFilter();
        this.createElementList();
        this.onChange();
    }

    // @ts-ignore
    protected createElement(t: T): Node {
        return document.createElement("div");
    }

    protected createElementList() {
        this.grid.replaceChildren();
        for (const t of this.elements) {
            this.grid.appendChild(this.createElement(t));
        }
    }


    // @ts-ignore
    protected rarityClick(button: HTMLButtonElement) {
        const rarity = button.dataset.value as PotionRarity;

        this.toggle(button);

        if (button.classList.contains("active")) {
            this.state.rarities.add(rarity);
        } else {
            this.state.rarities.delete(rarity);
        }

        this.onChange();
    }

    // @ts-ignore
    protected ancientClick(button: HTMLButtonElement) {

    }

    protected characterClick(button: HTMLButtonElement) {
        const value = button.dataset.value as PotionCharacter;
        this.toggle(button);

        if (button.classList.contains("active")) {
            this.disableOtherElements(this.characterFilters, value);
            this.state.characters = value;
        } else {
            this.selectAnyCharacter();
            this.state.characters = "any";
        }
        this.onChange();
    }

    protected setupSearchFilter() {

        this.searchBar.addEventListener(
            "beforeinput",
            event => {
                alphaSanitizer(event);
            }
        );
        this.searchBar.addEventListener(
            "input",
            () => this.searchHelper()
        );
    }

    protected setupFilters(filters: NodeListOf<HTMLButtonElement>, callback: (button: HTMLButtonElement) => void) {
        filters.forEach(button => {
            button.addEventListener("click", () => callback(button));
        });
    }

    protected searchHelper() {
        this.state.query = this.searchBar.textContent;
        console.log(this.state.query)
        this.onChange();
    }

    // @ts-ignore
    protected matchesFilters(t: T): boolean {
        return this.matchesSearch(t);
    }

    protected matchesSearch(t: T): boolean {
        if (this.state.query.trim() === "") return true;
        return this.state.matches.has(t.id)
    }

    protected onChange() {
        let i = 0;
        this.state.matches = new Set(
            this.fuse
                .search(this.state.query)
                .map(result => result.item.id)
        );
        for (const element of this.grid.children) {
            let e = this.elements[i];
            (<HTMLElement>element).hidden = !this.matchesFilters(e);
            i++;
        }
    }

    protected toggle(button: HTMLButtonElement) {
        const active = button.classList.toggle("active");

        button.setAttribute(
            "aria-pressed",
            String(active)
        );
    }

    protected forceOn(button: HTMLButtonElement) {
        button.classList.add("active");
        button.setAttribute("aria-pressed", String(true));
    }

    protected forceOff(button: HTMLButtonElement) {
        button.classList.remove("active");
        button.setAttribute("aria-pressed", String(false));
    }

    protected disableAllRarity() {
        this.rarityFilters.forEach(button => {this.forceOff(button);});
        this.state.rarities.clear();
    }

    protected disableOtherElements(
        filter: NodeListOf<HTMLButtonElement>,
        name: RelicAncient | RelicCharacter | RelicRarity) {
        filter.forEach(button => {
            const value = button.dataset.value;
            if (value !== name) {
                this.forceOff(button)
            }
        })
    }

    setCharacter(character: string) {
        this.characterFilters.forEach(button => {
            const active = button.dataset.value === character;

            if (active) {
                this.toggle(button);
                this.state.characters =  character as PotionCharacter;
            }
        });
        this.onChange();
    }

    protected selectAnyCharacter() {
        this.characterFilters.forEach(button => {
            const isAny = button.dataset.value === "any";

            button.classList.toggle("active", isAny);
            button.setAttribute("aria-pressed", String(isAny));
        });
        this.state.characters = "any";
    }
}