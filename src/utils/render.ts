import {renderDescription} from "./description-renderer.ts";

const tooltipContents = document.createElement("div");
tooltipContents.classList.add("tooltip-contents");
document.body.appendChild(tooltipContents);

export function createTooltipContainer(cleanedName: string, description: string, image: HTMLImageElement): HTMLElement {
    if (cleanedName==="plus_icon") return image;
    if (description==="") return image;

    const tooltipContainer = document.createElement("div");
    tooltipContainer.classList.add("tooltip-container");
    tooltipContainer.appendChild(image);

    tooltipContainer.addEventListener("mouseenter", () => {
        tooltipContents.replaceChildren(renderDescription(description));
        tooltipContents.style.display = "block";

        const rect = tooltipContainer.getBoundingClientRect();

        let top = rect.bottom + 6;
        let left = rect.left;

        const tooltipWidth = tooltipContents.offsetWidth;
        if (left + tooltipWidth > window.innerWidth - 16) {
          left = rect.right - tooltipWidth;
        }

        tooltipContents.style.top = `${top}px`;
        tooltipContents.style.left = `${Math.max(16, left)}px`;
  });

  tooltipContainer.addEventListener("mouseleave", () => {
    tooltipContents.style.display = "none";
  });

  return tooltipContainer;
}

