import type {SaveInfo} from "../../app/types.ts";
import {cleanCharName} from "../../utils/sanitization.ts";

export function createSaveCard(sf: SaveInfo, onSelect: (save: SaveInfo) => void): HTMLDivElement {
    const card = document.createElement("div");
    card.classList.add("save-card")
    card.setAttribute("char-name", cleanCharName(sf.character));

    card.innerHTML = `<div class="save-file-image">
            <div class="charcension">
              <h3 class="save-card-character"></h3>
              <div class="ascension" ascension-value="${sf.ascension}"></div>
            </div>
          </div>
          <div class="save-card-bottom">
            <div class="floor-deck-stats">
              <div class="stat-item">
                <span class="stat-icon icon-floor"></span>
                <span class="floor-value" contenteditable="false" spellcheck="false">${sf.floor + 1}</span>
              </div>
              <div class="stat-item">
                <span class="stat-icon icon-deck"></span>
                <span class="deck-value" contenteditable="false" spellcheck="false">${sf.deck_size}</span>
              </div>
            </div>
            <button type="button" class="file-select"></button>`;
    const button =
        card.querySelector<HTMLButtonElement>(".file-select")!;
    button.addEventListener("click", async () => {onSelect(sf);});

    return card;
}