import {Card} from "../../app/types.ts";
import {cleanCardName, cleanEnchantmentName} from "../../utils/sanitization.ts";
import {getCardHelper, getCardPath, lazyLoadImage} from "../../utils/image.ts";

export function renderCard(element: HTMLElement, card: Card, base: HTMLImageElement) {
    const cardName = cleanCardName(card.id);
    element.classList.add("card-entry");
    element.setAttribute("card-name", cardName);


    const enchantment = makeEnchantmentBadge(card);

    element.appendChild(base);
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

export async function renderCardImage(card: Card) {
    const image = document.createElement("img");
    image.src = getCardPath(card);
    image.classList.add("card-image");

    return image;
}

export function renderCardLazy(cardID: string, upgraded: boolean=false) {
    const image = document.createElement("img");
    lazyLoadImage(image, getCardHelper(cleanCardName(cardID), upgraded));
    image.classList.add("card-image");

    return image;
}