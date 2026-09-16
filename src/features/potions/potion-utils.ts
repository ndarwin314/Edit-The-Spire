import {getImage, getPotionPath, lazyLoadImage} from "../../utils/image.ts";
import {createTooltipContainer} from "../../utils/render.ts";

export function cleanPotionName(potion: string): string {
    return potion.replace("POTION.", "").toLowerCase();
}

export async function renderPotionImage(potionID: string) {
    const image = document.createElement("img");
    const path = getPotionPath(potionID);

    image.src = await getImage(path);
    return image;
}

export function renderPotionLazy(potionID: string) {
    const image = document.createElement("img");
    const path = getPotionPath(potionID);
    lazyLoadImage(image, path);
    return image;
}

export function renderPotionElement(potionID: string, description: string, image: HTMLImageElement) {
    const element = document.createElement("div");

    element.classList.add("item-slot");

    element.appendChild(createTooltipContainer(cleanPotionName(potionID), description, image));
    return element
}