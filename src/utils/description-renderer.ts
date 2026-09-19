
export function renderDescription(
    description: string,
): DocumentFragment {

    // matches  [ ] blocks with a span that break up the block into multiple elements
    const regex = /\[{1,2}.*(?<content><span.*<\/span>)]{1,2}/;
    description = description.replace(regex, "$<content>");

    const parsed = new DOMParser().parseFromString(
        `<div>${description}</div>`,
        "text/html",
    );
    const root = parsed.body.firstElementChild;
    const fragment = document.createDocumentFragment();

    if (!root) {
        fragment.append(document.createTextNode(description));
        return fragment;
    }

    appendChildren(root as HTMLElement, fragment);
    return fragment;
}
function appendChildren(
    source: HTMLElement,
    destination: Node,
): void {
    //debugger;
    for (const child of source.childNodes) {
        appendNode(child, destination);
    }
}

function appendNode(
    source: Node,
    destination: Node,
): void {
    if (source.nodeType === Node.TEXT_NODE) {
        appendTextWithWikiMarkup(
            source.textContent ?? "",
            destination,
        );
        return;
    }

    if (source.nodeType !== Node.ELEMENT_NODE) {
        return;
    }

    const element = source as HTMLElement;
    const tag = element.tagName.toLowerCase();

    if (tag === "br") {

        destination.appendChild(document.createElement("br"));
        return;
    }

    if (tag === "span") {
        const span = document.createElement("span");

        // Only copy the attributes that the scraper currently uses.
        copyAttribute(element, span, "class");
        copyAttribute(element, span, "data-name");
        copyAttribute(element, span, "data-sequel");
        copyAttribute(element, span, "title");

        appendChildren(element, span);
        span.classList.add("keyword")
        destination.appendChild(span);
        return;
    }

    // Treat unknown elements as containers rather than trusting them.
    appendChildren(element, destination);
}

function copyAttribute(
    source: HTMLElement,
    destination: HTMLElement,
    name: string,
): void {
    const value = source.getAttribute(name);

    if (value !== null) {
        destination.setAttribute(name, value);
    }
}

/**
 * Parse MediaWiki syntax appearing inside text nodes.
 *
 * We handle the syntax actually present in the supplied relic data:
 *
 *   [[Page]]
 *   [[Page|Label]]
 *   [[File:Image.png|18px|middle|link=Page]]
 *   [https://example.com Label]
 */
function appendTextWithWikiMarkup(
    text: string,
    destination: Node,
): void {
    let position = 0;
    //debugger;
    while (position < text.length) {
        const nextWiki = text.indexOf("[[", position);
        const nextExternal = text.indexOf("[http", position);

        const candidates = [nextWiki, nextExternal].filter(
            (index) => index >= 0,
        );

        if (candidates.length === 0) {
            destination.appendChild(document.createTextNode(text.slice(position)));
            return;
        }

        const next = Math.min(...candidates);

        if (next > position) {
            destination.appendChild(
                document.createTextNode(text.slice(position, next)),
            );
        }

        if (next === nextWiki) {
            const end = findClosingDoubleBracket(text, next);

            if (end === -1) {
                destination.appendChild(
                    document.createTextNode(text.slice(next)),
                );
                return;
            }

            const markup = text.slice(next + 2, end);
            appendDoubleBracketMarkup(markup, destination);
            position = end + 2;
        } else {
            const end = text.indexOf("]", next);

            if (end === -1) {
                destination.appendChild(
                    document.createTextNode(text.slice(next)),
                );
                return;
            }

            const markup = text.slice(next + 1, end);
            appendExternalLinkMarkup(markup, destination);
            position = end + 1;
        }
    }
}

function findClosingDoubleBracket(text: string, start: number): number {
    return text.indexOf("]]", start + 2);
}

function appendDoubleBracketMarkup(
    markup: string,
    destination: Node,
): void {
    if (markup.startsWith("File:")) {
        appendFileMarkup(markup.slice("File:".length), destination);
        return;
    }

    const parts = markup.split("|");
    const target = parts[0].trim();

    if (!target) {
        return;
    }

    let label = parts.slice(1).join("|").trim();

    if (!label) {
        label = target;
    }

    // The wiki data sometimes puts HTML inside the link label.
    // Strip it down to text rather than allowing arbitrary HTML.
    label = htmlToText(label);

    const link = document.createElement("span");
    link.classList.add("description-link");
    link.dataset.wikiTarget = target;
    link.textContent = label;

    destination.appendChild(link);
}

function appendFileMarkup(
    markup: string,
    destination: Node,
): void {
    const parts = markup.split("|");
    const filename = parts.shift()?.trim();

    if (!filename) {
        return;
    }

    let width: number | undefined;
    let linkTarget: string | undefined;
    let middle = false;

    for (const part of parts) {
        const value = part.trim();

        const widthMatch = value.match(/^(\d+)px$/);
        if (widthMatch) {
            width = Number(widthMatch[1]);
            continue;
        }

        if (value === "middle") {
            middle = true;
            continue;
        }

        if (value.startsWith("link=")) {
            linkTarget = value.slice("link=".length).trim();
        }
    }

    const imageUrl = imageResolver(filename);

    // If the app doesn't have a local image for this file, fall back to
    // the filename as text rather than displaying a broken image.
    if (!imageUrl) {
        return;
    }

    const image = document.createElement("img");
    image.className = "description-icon";
    image.src = imageUrl;
    image.alt = filename;
    image.draggable = false;

    if (width !== undefined) {
        image.width = width;
    }

    if (middle) {
        image.classList.add("description-icon-middle");
    }

    if (linkTarget) {
        const wrapper = document.createElement("span");
        wrapper.className = "description-image-link";
        wrapper.dataset.wikiTarget = linkTarget;
        wrapper.append(image);
        destination.appendChild(wrapper);
    } else {
        destination.appendChild(image);
    }
}

function appendExternalLinkMarkup(
    markup: string,
    destination: Node
): void {
    const match = markup.match(/^(\S+)\s+([\s\S]*)$/);

    if (!match) {
        destination.appendChild(document.createTextNode(markup));
        return;
    }


    const rawLabel = match[2];
    const label = htmlToText(rawLabel);

    destination.appendChild(document.createTextNode(label));
    return;
}


function htmlToText(value: string): string {
    const doc = new DOMParser().parseFromString(
        `<div>${value}</div>`,
        "text/html",
    );

    return doc.body.textContent ?? value;
}

export function imageResolver(url: string): string | undefined {
    url = url.replace(/ /g, "_");
    url = url.replace("StS2_", "");
    url = url.replace(/[a-z][A-Z]/g, substring => substring[0]+"_"+substring[1].toLowerCase());
    url = url.replace(/[A-Z]/g, character => character.toLowerCase());
    if (url.startsWith("energy")) {
        url = url.replace(".png", ".webp");
        url = "/src/assets/stat-icons/" + url;
        return url;
    }
    return;
}

