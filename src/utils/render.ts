export function createTooltipContainer(cleanedName: string, image: HTMLImageElement): HTMLElement {
    if (cleanedName==="plus_icon") return image;
    const tooltipContainer = document.createElement("div");
    tooltipContainer.classList.add("tooltip-container");


    const tooltipContents = document.createElement("div");
    tooltipContents.classList.add("tooltip-contents");
    tooltipContents.textContent = cleanedName;

    tooltipContainer.appendChild(image);
    tooltipContainer.appendChild(tooltipContents);

    return tooltipContainer;
}

