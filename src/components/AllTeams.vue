<template>
    <base-dialog :show="!!error" title="Wystąpił błąd!" @close="handleError">
      <p>{{ error }}</p>
    </base-dialog>
    <base-dialog :show="isLoading" title="Pobieranie drużyn..." fixed>
        <base-spinner></base-spinner>
    </base-dialog>
    <div class="page">
        <div class="page-header">
            <h1>Wybierz swoją drużynę</h1>
            <p class="subtitle">Typuj zwycięzcę turnieju · 10 punktów za trafienie</p>
            <p v-if="winnerPickLocked" class="locked-notice">
                Turniej się rozpoczął — typ na mistrza jest zablokowany.
            </p>
            <p v-else-if="groupCount > 0" class="group-count">{{ teamCount }} drużyn · grupy A–{{ lastGroup }}</p>
        </div>
        <form class="teams-form" @submit.prevent="submitTeam">
            <div v-if="groupedTeams.length === 0" class="empty-state card">
                <p>Brak drużyn w turnieju. Uruchom seed na serwerze: npm run seed:wc2026-teams</p>
            </div>
            <div v-else class="groups-grid">
                <fieldset
                    v-for="group in groupedTeams"
                    :key="group.group"
                    class="group-card card"
                    :disabled="winnerPickLocked"
                >
                    <legend>Grupa {{ group.group }}</legend>
                    <label
                        v-for="team in group.teams"
                        :key="team.id"
                        class="team-option"
                        :class="{ selected: team.id === userTeam, locked: winnerPickLocked }"
                    >
                        <input
                            type="radio"
                            name="team"
                            :value="team.id"
                            v-model="userTeam"
                            :disabled="winnerPickLocked"
                        >
                        <team-name :name="team.name" :country-code="team.countryCode" class="team-label" />
                    </label>
                </fieldset>
            </div>
            <button
                v-if="!winnerPickLocked"
                class="btn btn-primary submit-btn"
                type="submit"
                :disabled="!userTeam"
            >
                Zapisz wybór
            </button>
        </form>
    </div>
</template>

<script>
import BaseDialog from "./BaseDialog.vue";
import BaseSpinner from "./BaseSpinner.vue";
import TeamName from "./TeamName.vue";

export default {
  components: { BaseDialog, BaseSpinner, TeamName },
    data() {
        return {
            error: null,
            isLoading: false,
            userTeam: null
        }
    },
    computed: {
        groupedTeams() {
            return this.$store.getters.teams;
        },
        teamCount() {
            return this.groupedTeams.reduce((sum, g) => sum + g.teams.length, 0);
        },
        groupCount() {
            return this.groupedTeams.length;
        },
        lastGroup() {
            if (this.groupCount === 0) return '';
            return this.groupedTeams[this.groupCount - 1].group;
        },
        initialUserTeam() {
            return this.$store.getters.userTeam;
        },
        winnerPickLocked() {
            return this.$store.getters.winnerPickLocked;
        }
    },
    watch: {
        initialUserTeam(val) {
            if (val) this.userTeam = val;
        }
    },
    methods: {
       async submitTeam() {
            if (!this.userTeam || this.winnerPickLocked) return;
            this.isLoading = true;
            try {
                await this.$store.dispatch("updateUserTeam", this.userTeam);
            } catch (error) {
                this.error = error.message || error;
            }
            this.isLoading = false;
        },
        handleError() {
            this.error = null
            this.$router.replace("/ranking");
        }
    },
    async mounted() {
        this.isLoading = true;
        try {
            await this.$store.dispatch("getTeams");
            await this.$store.dispatch("getWinnerPickStatus");
        } catch (error) {
            this.error = error.message;
        }

        const userId = this.$store.getters.userId;

        try {
            await this.$store.dispatch("getUserTeam", userId);
            if (this.initialUserTeam) {
                this.userTeam = this.initialUserTeam;
            }
        } catch (error) {
            this.error = error.message
        }
        this.isLoading = false;
    }
}
</script>

<style scoped>
.teams-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.groups-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
    gap: 1rem;
}

.group-card {
    padding: 1rem 1.25rem 1.25rem;
    border: 1px solid var(--color-border);
    margin: 0;
}

.group-card legend {
    font-weight: 700;
    font-size: 0.9375rem;
    color: var(--color-primary-mid);
    padding: 0 0.375rem;
}

.team-option {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.5rem 0.625rem;
    margin-top: 0.375rem;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: background 0.15s;
}

.team-option:hover {
    background: var(--color-surface-2);
}

.team-option.selected {
    background: var(--color-primary-muted);
    outline: 1px solid rgba(6, 182, 212, 0.35);
}

.team-option.locked {
    cursor: default;
    opacity: 0.85;
}

.team-option.locked:hover {
    background: transparent;
}

.team-option.locked.selected {
    background: var(--color-primary-muted);
}

.group-card:disabled {
    opacity: 1;
}

.team-option input {
    accent-color: var(--color-primary-mid);
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
}

.team-label {
    font-size: 0.9375rem;
    font-weight: 500;
    flex: 1;
}

.submit-btn {
    align-self: center;
    min-width: 12rem;
}

.submit-btn:disabled {
    opacity: 0.6;
}

.group-count {
    margin: 0.25rem 0 0;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-primary-mid);
}

.locked-notice {
    margin: 0.5rem 0 0;
    padding: 0.625rem 1rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-wrong);
    background: var(--color-wrong-bg);
    border-radius: var(--radius-sm);
    display: inline-block;
}
</style>
