const GROUP_LETTERS = 'ABCDEFGHIJKL'.split('');

export const GROUP_STAGE_PRESETS = GROUP_LETTERS.map(
    (letter) => `Grupa ${letter}`
);

export const KNOCKOUT_STAGE_PRESETS = [
    '1/16 finału',
    '1/8 finału',
    '1/4 finału',
    'Półfinał',
    'Mecz o 3. miejsce',
    'Finał',
];

export const STAGE_PRESETS = [...GROUP_STAGE_PRESETS, ...KNOCKOUT_STAGE_PRESETS];

export const CUSTOM_STAGE_VALUE = '__custom__';
