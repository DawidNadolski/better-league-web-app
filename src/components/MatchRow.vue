<template>
    <base-dialog :show="!!error" title="Wystąpił błąd!" @close="handleError">
      <p>{{ error }}</p>
    </base-dialog>
    <base-dialog :show="isLoading" title="Typowanie w trakcie..." fixed>
        <base-spinner></base-spinner>
    </base-dialog>
    <div class="match-card card" :class="{ live: isActive }">
        <div class="match-meta">
            <span class="match-date">{{ userBetData.startDate }}</span>
            <span v-if="isActive" class="live-badge">LIVE</span>
        </div>
        <div class="match-scoreline">
            <div class="team home">
                <team-name :name="userBetData.homeTeamName" :country-code="userBetData.homeTeamCountryCode" class="team-name" />
                <input
                    type="number"
                    min="0"
                    id="homeTeamGoals"
                    v-model="homeTeamGoals"
                    :disabled="isActive"
                    aria-label="Gole gospodarzy"
                >
            </div>
            <span class="separator">:</span>
            <div class="team away">
                <input
                    type="number"
                    min="0"
                    id="awayTeamGoals"
                    v-model="awayTeamGoals"
                    :disabled="isActive"
                    aria-label="Gole gości"
                >
                <team-name :name="userBetData.awayTeamName" :country-code="userBetData.awayTeamCountryCode" class="team-name" />
            </div>
        </div>
        <button
            class="btn btn-primary bet-btn"
            :disabled="isButtonDisabled"
            @click="submitBet"
        >
            {{ userBetData.betHomeTeamGoals !== null ? 'Zaktualizuj typ' : 'Typuj' }}
        </button>
    </div>
</template>

<script>
import BaseDialog from './BaseDialog.vue';
import BaseSpinner from './BaseSpinner.vue';
import TeamName from './TeamName.vue';

export default {
    components: { BaseDialog, BaseSpinner, TeamName },
    props: ['userBetData'],
    data() {
        return {
            error: null,
            isLoading: false,
            homeTeamGoals: this.userBetData.betHomeTeamGoals,
            awayTeamGoals: this.userBetData.betAwayTeamGoals
        }
    },
    computed: {
        isBetValid() {
            return (this.homeTeamGoals !== null && this.homeTeamGoals !== '') &&
                   (this.awayTeamGoals !== null && this.awayTeamGoals !== '')
        },
        isActive() {
            return this.userBetData.state === 'live'
        },
        isButtonDisabled() {
            return this.isActive || !this.isBetValid
        }
    },
    methods: {
        async submitBet() {
            this.isLoading = true
            const payload = {
                matchId: this.userBetData.id,
                homeTeamGoals: Number(this.homeTeamGoals),
                awayTeamGoals: Number(this.awayTeamGoals)
            }
            try {
                await this.$store.dispatch('placeBet', payload);
            } catch(error) {
                this.error = error.message;
            }
            this.isLoading = false;
        },
        handleError() {
            this.error = null
        }
    }
}
</script>

<style scoped>
.match-card {
    padding: 1.25rem;
    transition: box-shadow 0.15s;
}

.match-card.live {
    border-color: var(--color-wrong);
    box-shadow: 0 0 0 1px var(--color-wrong), var(--shadow-md);
}

.match-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.match-date {
    font-size: 0.8125rem;
    color: var(--color-text-muted);
    font-weight: 500;
}

.live-badge {
    background: var(--color-wrong);
    color: white;
    font-size: 0.6875rem;
    font-weight: 700;
  letter-spacing: 0.06em;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.match-scoreline {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
}

.team {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    flex: 1;
}

.team.home {
    justify-content: flex-end;
}

.team.away {
    justify-content: flex-start;
}

.team-name {
    font-weight: 600;
    font-size: 0.9375rem;
    max-width: 7rem;
    text-align: center;
}

.team input {
    width: 3rem;
    height: 2.75rem;
    text-align: center;
    font-family: inherit;
    font-size: 1.25rem;
    font-weight: 700;
    border: 2px solid var(--color-border);
    border-radius: var(--radius-sm);
    background: var(--color-surface-2);
    transition: border-color 0.15s;
}

.team input:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: var(--shadow-glow);
}

.team input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.separator {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-text-muted);
    flex-shrink: 0;
}

.bet-btn {
    width: 100%;
}

@media (max-width: 480px) {
    .team-name {
        font-size: 0.8125rem;
        max-width: 4.5rem;
    }
}
</style>
