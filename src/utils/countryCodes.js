/**
 * Converts country codes to flag emoji.
 * Standard ISO 3166-1 Alpha-2 codes use regional indicator symbols.
 * EN and SX are app-specific codes for England and Scotland (ISO only defines GB).
 * @see https://www.iban.com/country-codes
 */
const SUBDIVISION_FLAGS = {
    EN: subdivisionFlag('gbeng'),
    SX: subdivisionFlag('gbsct'),
};

function subdivisionFlag(tagLetters) {
    const codePoints = [0x1f3f4];
    for (const char of tagLetters.toLowerCase()) {
        codePoints.push(0xe0000 + char.charCodeAt(0));
    }
    codePoints.push(0xe007f);
    return String.fromCodePoint(...codePoints);
}

export function flagFromCountryCode(countryCode) {
    if (!countryCode) {
        return '⚽';
    }

    const upper = countryCode.toUpperCase();
    if (SUBDIVISION_FLAGS[upper]) {
        return SUBDIVISION_FLAGS[upper];
    }

    if (upper.length !== 2) {
        return '⚽';
    }

    return upper
        .split('')
        .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
        .join('');
}
