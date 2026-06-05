function formatTime(hour, minute) {
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function halfHourSlots(startHour, endHour, endWithHalfHour = true) {
    const times = [];

    for (let hour = startHour; hour <= endHour; hour += 1) {
        times.push(formatTime(hour, 0));

        const isLastHour = hour === endHour;
        if (!isLastHour || endWithHalfHour) {
            times.push(formatTime(hour, 30));
        }
    }

    return times;
}

/** 18:00 → 23:30 */
export const EVENING_TIME_PRESETS = halfHourSlots(18, 23);

/** 00:00 → 06:00 */
export const OVERNIGHT_TIME_PRESETS = halfHourSlots(0, 6, false);

export const MATCH_TIME_PRESETS = [...EVENING_TIME_PRESETS, ...OVERNIGHT_TIME_PRESETS];

export function combineMatchDateTime(date, time) {
    return new Date(`${date}T${time}`).toISOString();
}
