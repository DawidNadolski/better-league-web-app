<template>
  <div class="ranking-table-wrapper card">
    <table class="ranking-table">
      <thead>
        <tr>
          <th class="col-place">#</th>
          <th class="col-name">Typer</th>
          <th class="col-team" title="Podświetlone = trafiony mistrz turnieju">Mistrz</th>
          <th class="col-points">Punkty</th>
          <th class="col-stat" title="Dokładne wyniki">🎯</th>
          <th class="col-stat" title="Poprawne wyniki">✓</th>
          <th class="col-stat" title="Błędne wyniki">✗</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(user, index) in usersData"
          :key="user.userName"
          :class="placeClass(index)"
        >
          <td class="col-place">
            <span v-if="index === 0" class="medal gold">🥇</span>
            <span v-else-if="index === 1" class="medal silver">🥈</span>
            <span v-else-if="index === 2" class="medal bronze">🥉</span>
            <span v-else class="place-num">{{ index + 1 }}</span>
          </td>
          <td class="col-name">{{ user.userName }}</td>
          <td class="col-team">
            <span
              v-if="user.winningTeamName"
              class="team-pick"
              :class="{ 'team-pick--winner': user.pickedWinner }"
            >
              <team-name
                :name="user.winningTeamName"
                :country-code="user.winningTeamCountryCode"
              />
            </span>
            <span v-else class="no-pick">—</span>
          </td>
          <td class="col-points"><strong>{{ user.points }}</strong></td>
          <td class="col-stat exact">{{ user.exactResults }}</td>
          <td class="col-stat correct">{{ user.correctResults }}</td>
          <td class="col-stat wrong">{{ user.wrongResults }}</td>
        </tr>
      </tbody>
    </table>
    <p v-if="usersData.length === 0" class="empty">Brak danych do wyświetlenia.</p>
  </div>
</template>

<script>
import TeamName from './TeamName.vue';

export default {
    components: { TeamName },
    props: ["usersData"],
    methods: {
        placeClass(index) {
            if (index === 0) return 'row-gold';
            if (index === 1) return 'row-silver';
            if (index === 2) return 'row-bronze';
            return '';
        }
    }
};
</script>

<style scoped>
.ranking-table-wrapper {
  overflow: hidden;
}

.ranking-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9375rem;
}

.ranking-table thead {
  background: linear-gradient(to bottom, var(--color-bg-tint), var(--color-surface-2));
}

.ranking-table th {
  padding: 0.875rem 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-text-muted);
  border-bottom: 1px solid var(--color-border);
}

.ranking-table td {
  padding: 0.875rem 1rem;
  border-bottom: 1px solid var(--color-border);
}

.ranking-table tbody tr:last-child td {
  border-bottom: none;
}

.ranking-table tbody tr:hover {
  background: var(--color-surface-2);
}

.row-gold td { background: var(--color-gold-bg); }
.row-silver td { background: var(--color-silver-bg); }
.row-bronze td { background: var(--color-bronze-bg); }

.col-place { width: 3.5rem; text-align: center; }
.col-team { min-width: 7rem; }
.col-points { width: 5rem; }
.col-stat { width: 3rem; text-align: center; }

.team-pick {
  display: inline-flex;
  align-items: center;
  border-radius: var(--radius-sm);
  padding: 0.2rem 0.45rem;
  margin: -0.2rem -0.45rem;
}

.team-pick--winner {
  background: var(--color-exact-bg);
  box-shadow: inset 0 0 0 1px rgba(5, 150, 105, 0.35);
  font-weight: 600;
}

.team-pick--winner :deep(.team-name) {
  color: var(--color-exact);
}

.no-pick {
  color: var(--color-text-muted);
}

.col-points strong {
  color: var(--color-primary-mid);
  font-size: 1.0625rem;
}

.col-stat.exact { color: var(--color-exact); font-weight: 600; }
.col-stat.correct { color: var(--color-correct); font-weight: 600; }
.col-stat.wrong { color: var(--color-wrong); font-weight: 600; }

.place-num {
  color: var(--color-text-muted);
  font-weight: 500;
}

.medal {
  font-size: 1.25rem;
  line-height: 1;
}

.empty {
  padding: 2rem;
  text-align: center;
  color: var(--color-text-muted);
  margin: 0;
}

@media (max-width: 540px) {
  .ranking-table th,
  .ranking-table td {
    padding: 0.625rem 0.5rem;
    font-size: 0.8125rem;
  }

  .col-name {
    max-width: 5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .col-team {
    min-width: 0;
    max-width: 5.5rem;
  }

  .col-team :deep(.team-name) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
