import {Card} from "../app/types.ts";
import {cleanCardName, cleanRelicName} from "./sanitization.ts";
import {cleanPotionName} from "../features/potions/potion-utils.ts";

export const placeholder = "potion_placeholder";

const images = import.meta.glob(
    "/src/assets/**/*.*",
    {
        query: "?url",
        import: "default"
    }
);

export async function getImage(path: string) {
    const loader = images[path];

    if (!loader) {
        return "test";
        //throw new Error(`Image not found: ${path}`);
    }

    return await loader() as string;
}

export function getPlusPath() {
    return '/src/assets/general/plus_icon.png';
}

export function getRelicPath(relicID: string) {
    relicID = cleanRelicName(relicID);
    return relicID==="plus_icon" ? getPlusPath(): `/src/assets/relics/${relicID}.webp`
}

export function getPotionPath(potionID: string) {
    potionID = cleanPotionName(potionID);
    let path = placeholder;
    if (potionID != undefined) {
        path = potionID==="plus_icon" ? getPlusPath(): `/src/assets/potions/${potionID}.webp`
    }
    return path;
}

export function getCardHelper(card: string, upgraded: boolean) {
    return`/src/assets/card-renders/${card}${upgraded? "_upgraded": ""}.webp`;
}

export function getCardPath(card: Card) {
    const cardName = cleanCardName(card.id);
    const upgraded = !(card.current_upgrade_level===undefined || card.current_upgrade_level==0);
    return getCardHelper(cardName, upgraded);
}

export function lazyLoadImage(
    img: HTMLImageElement,
    path: string
) {
    const observer = new IntersectionObserver(
        async (entries, observer) => {
            if (!entries[0].isIntersecting) {
                return;
            }

            observer.disconnect();

            img.src = await getImage(path);
        },
        {
            rootMargin: "50px"
        }
    );

    observer.observe(img);
}
