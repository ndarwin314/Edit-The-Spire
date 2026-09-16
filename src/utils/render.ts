export function createTooltipContainer(cleanedName: string, description: string, image: HTMLImageElement): HTMLElement {
    if (cleanedName==="plus_icon") return image;
    if (description=="") return image;
    const tooltipContainer = document.createElement("div");
    tooltipContainer.classList.add("tooltip-container");


    const tooltipContents = document.createElement("div");
    tooltipContents.classList.add("tooltip-contents");
    tooltipContents.innerHTML = description

    tooltipContainer.appendChild(image);
    tooltipContainer.appendChild(tooltipContents);

    return tooltipContainer;
}

