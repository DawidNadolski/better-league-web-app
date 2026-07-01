<template>
  <base-dialog :show="!!error" title="Wystąpił błąd!" @close="handleError">
    <p>{{ error }}</p>
  </base-dialog>
  <base-dialog :show="isLoading" title="Pobieranie szczegółów meczu..." fixed>
    <base-spinner></base-spinner>
  </base-dialog>

  <div v-if="matchDetails" class="page">
    <router-link to="/matches" class="back-link">← Wróć do meczów</router-link>

    <div class="page-header">
      <p class="match-stage">{{ match.stage }}</p>
      <h1 class="match-title">
        <team-name :name="match.homeTeam.name" :country-code="match.homeTeam.countryCode" />
        <span class="score" v-if="match.hasEnded">
          {{ match.homeTeamGoals }} : {{ match.awayTeamGoals }}
        </span>
        <span class="vs" v-else>vs</span>
        <team-name :name="match.awayTeam.name" :country-code="match.awayTeam.countryCode" />
      </h1>
      <p class="subtitle">{{ formattedDate }}</p>
    </div>

    <section v-if="match.hasEnded" class="section">
      <h2 class="section-title">Podsumowanie typów</h2>
      <div class="summary-grid">
        <div class="summary-card exact">
          <span class="summary-count">{{ summary.exact }}</span>
          <span class="summary-label">Dokładne wyniki</span>
        </div>
        <div class="summary-card correct">
          <span class="summary-count">{{ summary.correct }}</span>
          <span class="summary-label">Poprawne wyniki</span>
        </div>
        <div class="summary-card wrong">
          <span class="summary-count">{{ summary.wrong }}</span>
          <span class="summary-label">Błędne typy</span>
        </div>
        <div class="summary-card missed">
          <span class="summary-count">{{ summary.missed }}</span>
          <span class="summary-label">Bez typu</span>
        </div>
      </div>
    </section>

    <section v-else class="section">
      <div class="upcoming-notice card">
        <p>Mecz jeszcze się nie zakończył — typy innych graczy są ukryte do czasu rozstrzygnięcia spotkania.</p>
        <p class="upcoming-stats">
          <strong>{{ placedBetsCount }}</strong> graczy postawiło typ ·
          <strong>{{ summary.missed }}</strong> bez typu
        </p>
      </div>
    </section>

    <section class="section">
      <h2 class="section-title">Typy graczy</h2>
      <match-bets-table
        :user-bets="userBets"
        :has-ended="match.hasEnded"
      />
    </section>
  </div>
</template>

<script>
import BaseDialog from './BaseDialog.vue';
import BaseSpinner from './BaseSpinner.vue';
import TeamName from './TeamName.vue';
import MatchBetsTable from './MatchBetsTable.vue';
import { formatMatchDate } from '@/utils/formatMatchDate';

export default {
    components: { BaseDialog, BaseSpinner, TeamName, MatchBetsTable },
    data() {
        return {
            error: null,
            isLoading: false,
        };
    },
    computed: {
        matchDetails() {
            return this.$store.getters.matchDetails;
        },
        match() {
            return this.matchDetails?.match;
        },
        summary() {
            return this.matchDetails?.summary || { exact: 0, correct: 0, wrong: 0, missed: 0 };
        },
        userBets() {
            return this.matchDetails?.userBets || [];
        },
        formattedDate() {
            if (!this.match) {
                return '';
            }
            return formatMatchDate(new Date(this.match.startDate));
        },
        placedBetsCount() {
            return this.userBets.filter((userBet) => userBet.status === 'pending').length;
        },
    },
    methods: {
        handleError() {
            this.error = null;
            this.$router.replace('/matches');
        },
        async loadMatchDetails() {
            this.isLoading = true;
            this.error = null;
            try {
                await this.$store.dispatch('fetchMatchDetails', this.$route.params.matchId);
            } catch (err) {
                this.error = err.message;
            }
            this.isLoading = false;
        },
    },
    async mounted() {
        if (!this.$store.getters.isAuthenticated) {
            this.$router.replace('/login');
            return;
        }
        await this.loadMatchDetails();
    },
    beforeUnmount() {
        this.$store.dispatch('clearMatchDetails');
    },
};
</script>

<style scoped>
.back-link {
  display: inline-block;
  margin-bottom: 1.25rem;
  color: var(--color-primary-mid);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 600;
}

.back-link:hover {
  text-decoration: underline;
}

.match-stage {
  margin: 0 0 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-primary-mid);
}

.match-title {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.75rem 1rem;
  margin: 0 0 0.25rem;
  font-size: 1.5rem;
}

.score,
.vs {
  font-weight: 700;
  color: var(--color-text-muted);
}

.section {
  margin-bottom: 2rem;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
}

.summary-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: 1.25rem 0.75rem;
  border-radius: var(--radius);
  border: 1px solid var(--color-border-light);
}

.summary-card.exact { background: var(--color-exact-bg); }
.summary-card.correct { background: var(--color-correct-bg); }
.summary-card.wrong { background: var(--color-wrong-bg); }
.summary-card.missed { background: var(--color-surface-2); }

.summary-count {
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1;
}

.summary-card.exact .summary-count { color: var(--color-exact); }
.summary-card.correct .summary-count { color: var(--color-correct); }
.summary-card.wrong .summary-count { color: var(--color-wrong); }
.summary-card.missed .summary-count { color: var(--color-text-muted); }

.summary-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.upcoming-notice {
  padding: 1.25rem;
  text-align: center;
}

.upcoming-notice p {
  margin: 0;
  color: var(--color-text-muted);
  line-height: 1.6;
}

.upcoming-stats {
  margin-top: 0.75rem !important;
  color: var(--color-text) !important;
}

@media (max-width: 640px) {
  .summary-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .match-title {
    font-size: 1.125rem;
  }
}
</style>
