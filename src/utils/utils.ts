import {Card} from "../app/types.ts";

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

export function cleanPotionName(potion: string): string {
    return potion.replace("POTION.", "").toLowerCase();
}

export function cleanCardName(card: string): string {
    return card.replace("CARD.", "").toLowerCase();
}

export function cleanEnchantmentName(enchantment: string): string {
    return enchantment.replace("ENCHANTMENT.", "").replace("_", " ").toLowerCase();
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

export function getCardImage(card: string, upgraded: boolean) {
    return images[`/src/assets/card-renders/${card}${upgraded? "_upgraded": ""}.webp`];
}

export function getPlusIcon() {
    return images['/src/assets/general/plus_icon.png']
}

export function overlayOnClick(event: Event, fun: () => void) {
    if (event.target===event.currentTarget) {
        fun();
    }
}

export function renderCard(element: HTMLElement, card: Card) {
    const cardName = cleanCardName(card.id);
    element.classList.add("card-entry");
    element.setAttribute("card-name", cardName);

    const image = makeCardImage(card);
    const enchantment = makeEnchantmentBadge(card);

    element.appendChild(image);
    element.appendChild(enchantment);
}

export function makeEnchantmentBadge(card: Card) {
    const enchantment = document.createElement("div");
    enchantment.classList.add("enchantment-badge");

    if (card.enchantment && card.enchantment.id) {
        const enchantmentName = cleanEnchantmentName(card.enchantment.id);
        enchantment.setAttribute("enchantment", enchantmentName);

        if (card.enchantment.amount != undefined) {
            const badgeValue = document.createElement("span");
            badgeValue.classList.add("badge-value");
            if (card.enchantment.amount > 0) {
                badgeValue.textContent = card.enchantment.amount.toString();
            }
            enchantment.appendChild(badgeValue);
        }
    } else {
        enchantment.setAttribute("enchantment", "none");
    }
    return enchantment;
}

export function makeCardImage(card: Card) {
    const image = document.createElement("img");
    image.src = getCardURL(card);
    image.classList.add("card-image");

    return image;
}


export function getCardURL(card: Card) {
    const cardName = cleanCardName(card.id);
    const upgraded = !(card.current_upgrade_level===undefined || card.current_upgrade_level==0);
    return getCardImage(cardName, upgraded);
}
