import Fuse from "fuse.js";
import {alphaSanitizer} from "./sanitization.ts";

export interface FilterState {
    query: string
    matches: Set<String>
}

export interface Definition {
    name: string
    id: string
}

export class Filter<T extends Definition> {
    protected readonly fuse: Fuse<T>;
    protected state!: FilterState;

    constructor(
        protected readonly grid: HTMLElement,
        protected readonly searchBar: HTMLElement,
        protected readonly elements: T[],
    ) {
        this.fuse = new Fuse(elements, {
            keys: ['name'],
            includeScore: true,
            threshold: 0.2
        });
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

    protected searchHelper() {
        this.state.query = this.searchBar.textContent;
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
}