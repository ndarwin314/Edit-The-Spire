import {getImage, getPotionPath, lazyLoadImage} from "../../utils/image.ts";
import {createTooltipContainer} from "../../utils/render.ts";
import {PotionDefinition, potions} from "./potion-list.ts";

let potionLookup: Map<string, PotionDefinition> = new Map()
for (const potion of potions) {
    potionLookup.set(potion.id, potion)
}

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

export function renderPotionElement(potionID: string, image: HTMLImageElement) {
    const element = document.createElement("div");
    let description: string = "";
    if (potionID!="potion_placeholder" && potionID!="plus_icon") {
        description = potionLookup.get(potionID)!.description;
    }

    element.classList.add("item-slot");

    element.appendChild(createTooltipContainer(cleanPotionName(potionID), description, image));
    return element
}