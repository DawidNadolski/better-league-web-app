<template>
  <div class="match-bets-table-wrapper card">
    <table class="match-bets-table">
      <thead>
        <tr>
          <th class="col-name">Typer</th>
          <th class="col-bet">Typ</th>
          <th class="col-points">Punkty</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="userBet in userBets"
          :key="userBet.userId"
          :class="rowClass(userBet.status)"
        >
          <td class="col-name">{{ userBet.userName }}</td>
          <td class="col-bet">
            <span v-if="userBet.status === 'missed'" class="no-bet">brak</span>
            <span v-else-if="userBet.status === 'pending'" class="hidden-bet">ukryty</span>
            <span v-else class="bet-score">{{ userBet.homeTeamGoals }} : {{ userBet.awayTeamGoals }}</span>
          </td>
          <td class="col-points">
            <span class="points-badge" :class="userBet.status">
              {{ pointsLabel(userBet) }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-if="userBets.length === 0" class="empty">Brak danych do wyświetlenia.</p>
  </div>
</template>

<script>
export default {
    props: {
        userBets: {
            type: Array,
            required: true,
        },
        hasEnded: {
            type: Boolean,
            required: true,
        },
    },
    methods: {
        rowClass(status) {
            if (!this.hasEnded && status === 'pending') {
                return 'row-pending';
            }
            return `row-${status}`;
        },
        pointsLabel(userBet) {
            if (userBet.status === 'missed') {
                return '—';
            }
            if (userBet.status === 'pending') {
                return '—';
            }
            return `+${userBet.points} pkt`;
        },
    },
};
</script>

<style scoped>
.match-bets-table-wrapper {
  overflow: hidden;
}

.match-bets-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9375rem;
}

.match-bets-table thead {
  background: linear-gradient(to bottom, var(--color-bg-tint), var(--color-surface-2));
}

.match-bets-table th {
  padding: 0.875rem 1rem;
  font-weight: 600;
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-text-muted);
  border-bottom: 1px solid var(--color-border);
}

.match-bets-table td {
  padding: 0.875rem 1rem;
  border-bottom: 1px solid var(--color-border);
}

.match-bets-table tbody tr:last-child td {
  border-bottom: none;
}

.col-name { min-width: 8rem; text-align: left; }
.col-bet { text-align: center; }
.col-points { width: 6.5rem; text-align: center; }

.row-exact td { background: var(--color-exact-bg); }
.row-correct td { background: var(--color-correct-bg); }
.row-wrong td { background: var(--color-wrong-bg); }
.row-missed td { background: var(--color-surface-2); }
.row-pending td { background: var(--color-surface); }

.bet-score {
  font-weight: 700;
  font-size: 1rem;
}

.no-bet,
.hidden-bet {
  color: var(--color-text-muted);
  font-style: italic;
}

.points-badge {
  display: inline-block;
  font-size: 0.8125rem;
  font-weight: 700;
  padding: 0.25rem 0.625rem;
  border-radius: 999px;
}

.points-badge.exact { background: var(--color-exact-bg); color: var(--color-exact); }
.points-badge.correct { background: var(--color-correct-bg); color: var(--color-correct); }
.points-badge.wrong { background: var(--color-wrong-bg); color: var(--color-wrong); }
.points-badge.missed,
.points-badge.pending {
  background: var(--color-border-light);
  color: var(--color-text-muted);
}

.empty {
  padding: 2rem;
  text-align: center;
  color: var(--color-text-muted);
  margin: 0;
}

@media (max-width: 540px) {
  .match-bets-table th,
  .match-bets-table td {
    padding: 0.625rem 0.5rem;
    font-size: 0.8125rem;
  }
}
</style>
