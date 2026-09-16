import {cleanRelicName} from "../../utils/sanitization.ts";
import {getImage, getRelicPath, lazyLoadImage} from "../../utils/image.ts";
import {createTooltipContainer} from "../../utils/render.ts";


export function renderRelicElement(relicID: string, description: string, image: HTMLImageElement) {
    const element = document.createElement("div");
    let cleanedName = cleanRelicName(relicID);
    element.classList.add("item-slot");

    element.appendChild(createTooltipContainer(cleanedName, description, image));

    return element;
}

export async function renderRelicImage(relicID: string) {
    const cleanedName = cleanRelicName(relicID);
    const image = document.createElement("img");

    const path = getRelicPath(cleanedName);
    image.src = await getImage(path);
    return image;
}

export function renderRelicLazy(relicID: string) {
    const cleanedName = cleanRelicName(relicID);
    const image = document.createElement("img");

    let path = getRelicPath(cleanedName);
    lazyLoadImage(image, path);
    return image;
}