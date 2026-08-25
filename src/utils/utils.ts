const images = import.meta.glob(
    "/src/assets/**/*.*",
    {
        eager: true,
        query: "?url",
        import: "default"
    }
);

export function getElement<T extends Element>(selector: string): T {
    const element = document.querySelector<T>(selector);

    if (!element) {
        throw new Error(`Missing required element: ${selector}`);
    }

    return element;
}

export function getElements<T extends Element>(selector: string): NodeListOf<T> {
    const elements = document.querySelectorAll<T>(selector);

    if (!elements) {
        throw new Error(`Missing required element: ${selector}`);
    }

    return elements;
}

export function cleanCharName(char: string): string {
    char = char.replace("CHARACTER.", "").toLowerCase();
    char = char.charAt(0).toUpperCase() + char.slice(1);
    return "The " + char;
}


export function cleanRelicName(relic: string): string {
    const name= relic.replace("RELIC.", "").toLowerCase();
    if (name==="the_chosen_cheese") {
        return "chosen_cheese";
    }
    return name;
}

export function cleanPotionName(relic: string): string {
    return relic.replace("POTION.", "").toLowerCase();
}

export function input_sanitizer(event: InputEvent) {
    if (event.inputType.startsWith("insert")) {
        if (event.data && !/^\d+$/.test(event.data)) {
            event.preventDefault();
        }
    }
}

export function getRelicImage(relic: string) {
    return images[`/src/assets/Relics/${relic}.webp`];
}

export function getPotionImage(potion: string) {
    return images[`/src/assets/Potions/${potion}.webp`];
}

export function getPlusIcon() {
    return images['/src/assets/general/plus_icon.png']
}
