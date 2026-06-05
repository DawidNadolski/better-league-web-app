<template>
    <span class="team-display">
        <span class="team-flag" :title="countryCode || undefined" aria-hidden="true">{{ flag }}</span>
        <span class="team-name">{{ name }}</span>
    </span>
</template>

<script>
import { flagFromCountryCode } from '@/utils/countryCodes';

export default {
    props: {
        name: {
            type: String,
            required: true,
        },
        countryCode: {
            type: String,
            default: null,
        },
    },
    computed: {
        flag() {
            return flagFromCountryCode(this.countryCode);
        },
    },
};
</script>

<style scoped>
.team-display {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}

.team-flag {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.5rem;
    font-size: 1.35rem;
    line-height: 1;
    flex-shrink: 0;
    font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;
}

.team-name {
    line-height: 1.3;
}
</style>
