/**
 * @param {Date | string | number} value
 * @returns {string}
 */
export function formatMatchDate(value) {
    const date = value instanceof Date ? value : new Date(value);

    const datePart = date.toLocaleDateString('pl-PL', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${datePart}, ${hours}:${minutes}`;
}
