export function getElement<T extends Element>(selector: string): T {
    const element = document.querySelector<T>(selector);

    if (!element) {
        throw new Error(`Missing required element: ${selector}`);
    }

    return element;
}

export function getElements<T extends Element>(selector: string): NodeListOf<T> {
    const elements = document.querySelectorAll<T>(selector);

    if (!elements) {
        throw new Error(`Missing required element: ${selector}`);
    }

    return elements;
}

export function overlayOnClick(event: Event, fun: () => void) {
    if (event.target===event.currentTarget) {
        fun();
    }
}