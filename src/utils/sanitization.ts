export function cleanCharName(char: string): string {
    char = char.replace("CHARACTER.", "").toLowerCase();
    char = char.charAt(0).toUpperCase() + char.slice(1);
    return "The " + char;
}


export function cleanRelicName(relic: string): string {
    const name= relic.replace("RELIC.", "").toLowerCase();
    if (name==="the_chosen_cheese") {
        return "chosen_cheese";
    }
    return name;
}

export function cleanCardName(card: string): string {
    return card.replace("CARD.", "").toLowerCase();
}

export function cleanEnchantmentName(enchantment: string): string {
    return enchantment.replace("ENCHANTMENT.", "").replace("_", " ").toLowerCase();
}

export function integralSanitizer(event: InputEvent) {
    if (event.inputType.startsWith("insert")) {
        if (event.data && !/^\d+$/.test(event.data)) {
            event.preventDefault();
        }
    }
}

export function alphaSanitizer(event: InputEvent) {
    if (event.inputType.startsWith("insert")) {
        if (event.data && !/^[a-zA-Z ]+$/.test(event.data)) {
            event.preventDefault();
        }
    }
}