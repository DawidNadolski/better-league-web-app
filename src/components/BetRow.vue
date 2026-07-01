<template>
    <div class="bet-card card" :class="result">
        <div class="bet-header">
            <div class="meta-left">
                <span class="bet-date">{{ userBetData.startDate }}</span>
                <span class="match-stage">{{ userBetData.stage }}</span>
            </div>
            <span class="points-badge" :class="result">+{{ points }} pkt</span>
        </div>
        <div class="score-block">
            <p class="label">Wynik</p>
            <p class="score match-line">
                <team-name :name="userBetData.homeTeamName" :country-code="userBetData.homeTeamCountryCode" />
                <strong>{{ userBetData.homeTeamGoals }} : {{ userBetData.awayTeamGoals }}</strong>
                <team-name :name="userBetData.awayTeamName" :country-code="userBetData.awayTeamCountryCode" />
            </p>
        </div>
        <div class="score-block">
            <p class="label">Twój typ</p>
            <p v-if="isBet" class="score match-line prediction">
                <team-name :name="userBetData.homeTeamName" :country-code="userBetData.homeTeamCountryCode" />
                <strong>{{ userBetData.betHomeTeamGoals }} : {{ userBetData.betAwayTeamGoals }}</strong>
                <team-name :name="userBetData.awayTeamName" :country-code="userBetData.awayTeamCountryCode" />
            </p>
            <p v-else class="no-bet">brak</p>
        </div>
        <router-link
            :to="`/matches/${userBetData.id}`"
            class="details-btn"
            :class="`details-btn--${result}`"
        >
            Szczegóły
        </router-link>
    </div>
</template>

<script>
import TeamName from './TeamName.vue';

export default {
    components: { TeamName },
    props: ['userBetData'],
    computed: {
        isBet() {
            return (this.userBetData.betHomeTeamGoals !== null) && (this.userBetData.betAwayTeamGoals !== null)
        },
        result() {
            if (!this.isBet) return 'no-bet';
            if (this.userBetData.points === 3) return 'exact';
            if (this.userBetData.points === 1) return 'correct';
            return 'wrong';
        },
        points() {
            return this.userBetData.points;
        }
    }
}
</script>

<style scoped>
.bet-card {
    padding: 1.25rem;
    border-left: 4px solid var(--color-border);
}

.bet-card.exact {
    border-left-color: var(--color-exact);
    background: linear-gradient(to right, var(--color-exact-bg), var(--color-surface));
}

.bet-card.correct {
    border-left-color: var(--color-correct);
    background: linear-gradient(to right, var(--color-correct-bg), var(--color-surface));
}

.bet-card.wrong {
    border-left-color: var(--color-wrong);
    background: linear-gradient(to right, var(--color-wrong-bg), var(--color-surface));
}

.bet-card.no-bet {
    border-left-color: var(--color-border);
    background: var(--color-surface-2);
    opacity: 0.92;
}

.bet-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.meta-left {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
}

.bet-date {
    font-size: 0.8125rem;
    color: var(--color-text-muted);
}

.match-stage {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-primary-mid);
}

.points-badge {
    font-size: 0.8125rem;
    font-weight: 700;
    padding: 0.25rem 0.625rem;
    border-radius: 999px;
}

.points-badge.exact { background: var(--color-exact-bg); color: var(--color-exact); }
.points-badge.correct { background: var(--color-correct-bg); color: var(--color-correct); }
.points-badge.wrong { background: var(--color-wrong-bg); color: var(--color-wrong); }
.points-badge.no-bet { background: var(--color-border-light); color: var(--color-text-muted); }

.score-block {
    margin-bottom: 0.75rem;
}

.score-block:last-child {
    margin-bottom: 0;
}

.label {
    margin: 0 0 0.25rem;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-text-muted);
}

.score {
    margin: 0;
    font-size: 0.9375rem;
}

.match-line {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 0.5rem 0.625rem;
}

.score strong {
    font-size: 1.125rem;
    color: var(--color-text);
}

.prediction strong {
    color: var(--color-primary-mid);
}

.no-bet {
    margin: 0;
    color: var(--color-text-muted);
    font-style: italic;
}

.bet-card .details-btn {
    margin-top: 1rem;
}
</style>
