import { createSaveCard } from "./save-card";
import { showPage } from "../../app/navigation";
import { saves } from "../../services/tauri.ts";
import {SaveInfo} from "../../app/types.ts";
import {getElement} from "../../utils/dom.ts";


const grid = getElement<HTMLDivElement>("#save-grid");

export async function loadSaveList(onSelect: (save: SaveInfo) => void) {

    const s = await saves.find()
    grid.replaceChildren();

    for (const save of s) {
        const card = createSaveCard(save, onSelect);
        grid.appendChild(card);
    }
    showPage("saveSelector")
}