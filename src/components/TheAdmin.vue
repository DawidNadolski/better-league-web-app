<template>
    <base-dialog :show="!!error" title="Wystąpił błąd!" @close="error = null">
        <p>{{ error }}</p>
    </base-dialog>
    <base-dialog :show="isLoading" title="Ładowanie..." fixed>
        <base-spinner></base-spinner>
    </base-dialog>

    <div class="page">
        <div class="page-header">
            <h1>Panel administratora</h1>
            <p class="subtitle">Mundial 2026 · zarządzanie meczami</p>
        </div>

        <section class="admin-section card">
            <h2 class="section-title">Dodaj mecz</h2>
            <form class="admin-form" @submit.prevent="submitCreateMatch">
                <div class="form-row">
                    <div class="form-control">
                        <label for="home-team">Gospodarze</label>
                        <select id="home-team" v-model="newMatch.homeTeamName" required>
                            <option disabled value="">Wybierz drużynę</option>
                            <option v-for="team in teams" :key="team.id" :value="team.name">
                                {{ team.name }}
                            </option>
                        </select>
                    </div>
                    <div class="form-control">
                        <label for="away-team">Goście</label>
                        <select id="away-team" v-model="newMatch.awayTeamName" required>
                            <option disabled value="">Wybierz drużynę</option>
                            <option v-for="team in teams" :key="team.id" :value="team.name">
                                {{ team.name }}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-control">
                        <label for="stage">Faza</label>
                        <select id="stage" v-model="stageSelection" required>
                            <option disabled value="">Wybierz fazę</option>
                            <optgroup label="Faza grupowa">
                                <option
                                    v-for="stage in groupStagePresets"
                                    :key="stage"
                                    :value="stage"
                                >
                                    {{ stage }}
                                </option>
                            </optgroup>
                            <optgroup label="Faza pucharowa">
                                <option
                                    v-for="stage in knockoutStagePresets"
                                    :key="stage"
                                    :value="stage"
                                >
                                    {{ stage }}
                                </option>
                            </optgroup>
                            <option :value="customStageValue">Inna faza…</option>
                        </select>
                        <input
                            v-if="stageSelection === customStageValue"
                            v-model.trim="customStage"
                            type="text"
                            class="custom-stage-input"
                            placeholder="Wpisz nazwę fazy"
                            required
                        />
                    </div>
                <div class="form-row">
                    <div class="form-control">
                        <label for="match-date">Data</label>
                        <input
                            id="match-date"
                            v-model="newMatch.matchDate"
                            type="date"
                            required
                        />
                    </div>
                    <div class="form-control">
                        <label for="match-time">Godzina</label>
                        <select id="match-time" v-model="newMatch.matchTime" required>
                            <option disabled value="">Wybierz godzinę</option>
                            <optgroup label="18:00 – 23:30">
                                <option
                                    v-for="time in eveningTimePresets"
                                    :key="time"
                                    :value="time"
                                >
                                    {{ time }}
                                </option>
                            </optgroup>
                            <optgroup label="00:00 – 06:00">
                                <option
                                    v-for="time in overnightTimePresets"
                                    :key="time"
                                    :value="time"
                                >
                                    {{ time }}
                                </option>
                            </optgroup>
                        </select>
                    </div>
                </div>
                </div>
                <button class="btn btn-primary" type="submit" :disabled="isSaving">
                    Dodaj mecz
                </button>
            </form>
        </section>

        <section v-if="unresolvedMatches.length > 0" class="admin-section card">
            <h2 class="section-title">Rozstrzygnij mecz</h2>
            <div class="match-list">
                <article
                    v-for="match in unresolvedMatches"
                    :key="match.id"
                    class="match-card"
                >
                    <div class="match-meta">
                        <span class="match-stage">{{ match.stage }}</span>
                        <span class="match-date">{{ formatDate(match.startDate) }}</span>
                    </div>
                    <form class="result-form" @submit.prevent="submitResult(match.id)">
                        <div class="result-row">
                            <team-name
                                :name="match.homeTeam.name"
                                :country-code="match.homeTeam.countryCode"
                            />
                            <input
                                v-model.number="resultScores[match.id].home"
                                type="number"
                                min="0"
                                class="score-input"
                                required
                            />
                            <span class="score-sep">:</span>
                            <input
                                v-model.number="resultScores[match.id].away"
                                type="number"
                                min="0"
                                class="score-input"
                                required
                            />
                            <team-name
                                :name="match.awayTeam.name"
                                :country-code="match.awayTeam.countryCode"
                            />
                        </div>
                        <button class="btn btn-primary btn-sm" type="submit" :disabled="isSaving">
                            Zapisz wynik
                        </button>
                    </form>
                </article>
            </div>
        </section>

        <section v-if="resolvedMatches.length > 0" class="admin-section card">
            <h2 class="section-title">Rozstrzygnięte mecze</h2>
            <ul class="resolved-list">
                <li v-for="match in resolvedMatches" :key="match.id">
                    <span class="match-stage">{{ match.stage }}</span>
                    <team-name
                        :name="match.homeTeam.name"
                        :country-code="match.homeTeam.countryCode"
                    />
                    <strong>{{ match.homeTeamGoals }} : {{ match.awayTeamGoals }}</strong>
                    <team-name
                        :name="match.awayTeam.name"
                        :country-code="match.awayTeam.countryCode"
                    />
                </li>
            </ul>
        </section>

        <section class="admin-section card">
            <h2 class="section-title">Mistrz turnieju</h2>
            <p v-if="tournamentWinner" class="current-winner">
                Obecny zwycięzca:
                <team-name
                    :name="tournamentWinner.name"
                    :country-code="tournamentWinner.countryCode"
                />
            </p>
            <form class="winner-form" @submit.prevent="submitWinner">
                <div class="form-control">
                    <label for="winner-team">Ustaw zwycięzcę turnieju</label>
                    <select id="winner-team" v-model="winnerTeamId" required>
                        <option disabled value="">Wybierz drużynę</option>
                        <option v-for="team in teams" :key="team.id" :value="team.id">
                            {{ team.name }}
                        </option>
                    </select>
                </div>
                <button class="btn btn-primary" type="submit" :disabled="isSaving || !winnerTeamId">
                    Zatwierdź mistrza
                </button>
            </form>
        </section>
    </div>
</template>

<script>
import BaseDialog from './BaseDialog.vue';
import BaseSpinner from './BaseSpinner.vue';
import TeamName from './TeamName.vue';
import {
    GROUP_STAGE_PRESETS,
    KNOCKOUT_STAGE_PRESETS,
    CUSTOM_STAGE_VALUE,
} from '@/config/matchStages';
import {
    EVENING_TIME_PRESETS,
    OVERNIGHT_TIME_PRESETS,
    combineMatchDateTime,
} from '@/config/matchTimes';
import { formatMatchDate } from '@/utils/formatMatchDate';

export default {
    components: { BaseDialog, BaseSpinner, TeamName },
    data() {
        return {
            error: null,
            isLoading: false,
            isSaving: false,
            groupStagePresets: GROUP_STAGE_PRESETS,
            knockoutStagePresets: KNOCKOUT_STAGE_PRESETS,
            eveningTimePresets: EVENING_TIME_PRESETS,
            overnightTimePresets: OVERNIGHT_TIME_PRESETS,
            customStageValue: CUSTOM_STAGE_VALUE,
            stageSelection: '',
            customStage: '',
            newMatch: {
                homeTeamName: '',
                awayTeamName: '',
                matchDate: '',
                matchTime: '',
            },
            resultScores: {},
            winnerTeamId: '',
        };
    },
    computed: {
        teams() {
            return this.$store.getters['admin/adminTeams'];
        },
        unresolvedMatches() {
            return this.$store.getters['admin/unresolvedMatches'];
        },
        resolvedMatches() {
            return this.$store.getters['admin/resolvedMatches'];
        },
        tournamentWinner() {
            return this.$store.getters['admin/tournamentWinner'];
        },
        selectedStage() {
            if (this.stageSelection === CUSTOM_STAGE_VALUE) {
                return this.customStage;
            }
            return this.stageSelection;
        },
    },
    watch: {
        unresolvedMatches: {
            immediate: true,
            handler(matches) {
                const scores = { ...this.resultScores };
                for (const match of matches) {
                    if (!scores[match.id]) {
                        scores[match.id] = { home: 0, away: 0 };
                    }
                }
                this.resultScores = scores;
            },
        },
        tournamentWinner: {
            immediate: true,
            handler(winner) {
                if (winner) {
                    this.winnerTeamId = winner.id;
                }
            },
        },
    },
    methods: {
        formatDate(isoDate) {
            return formatMatchDate(isoDate);
        },
        async submitCreateMatch() {
            this.isSaving = true;
            this.error = null;
            try {
                await this.$store.dispatch('admin/createMatch', {
                    homeTeamName: this.newMatch.homeTeamName,
                    awayTeamName: this.newMatch.awayTeamName,
                    stage: this.selectedStage,
                    date: combineMatchDateTime(
                        this.newMatch.matchDate,
                        this.newMatch.matchTime
                    ),
                });
                this.newMatch = {
                    homeTeamName: '',
                    awayTeamName: '',
                    matchDate: '',
                    matchTime: '',
                };
                this.stageSelection = '';
                this.customStage = '';
            } catch (err) {
                this.error = err.message || String(err);
            }
            this.isSaving = false;
        },
        async submitResult(matchId) {
            this.isSaving = true;
            this.error = null;
            const scores = this.resultScores[matchId];
            try {
                await this.$store.dispatch('admin/updateMatchResult', {
                    matchId,
                    homeTeamGoals: scores.home,
                    awayTeamGoals: scores.away,
                });
            } catch (err) {
                this.error = err.message || String(err);
            }
            this.isSaving = false;
        },
        async submitWinner() {
            this.isSaving = true;
            this.error = null;
            try {
                await this.$store.dispatch('admin/declareTournamentWinner', this.winnerTeamId);
            } catch (err) {
                this.error = err.message || String(err);
            }
            this.isSaving = false;
        },
    },
    async mounted() {
        if (!this.$store.getters.isAdmin) {
            this.$router.replace('/ranking');
            return;
        }

        this.isLoading = true;
        try {
            await this.$store.dispatch('admin/fetchAdminData');
        } catch (err) {
            this.error = err.message || String(err);
        }
        this.isLoading = false;
    },
};
</script>

<style scoped>
.admin-section {
    padding: 1.5rem;
    margin-bottom: 1.25rem;
}

.admin-form,
.winner-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.form-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
    gap: 1rem;
}

.form-control label {
    display: block;
    margin-bottom: 0.375rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-text-muted);
}

.form-control select,
.form-control input {
    width: 100%;
}

.custom-stage-input {
    margin-top: 0.5rem;
}

.match-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.match-card {
    padding: 1rem;
    border: 1px solid var(--color-border-light);
    border-radius: var(--radius-sm);
    background: var(--color-surface-2);
}

.match-meta {
    display: flex;
    justify-content: space-between;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
    font-size: 0.8125rem;
    color: var(--color-text-muted);
}

.match-stage {
    font-weight: 600;
    color: var(--color-primary-mid);
}

.result-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
}

.result-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem;
}

.score-input {
    width: 3.5rem;
    text-align: center;
    font-size: 1.125rem;
    font-weight: 700;
}

.score-sep {
    font-weight: 700;
    font-size: 1.125rem;
    color: var(--color-text-muted);
}

.btn-sm {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
}

.resolved-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
}

.resolved-list li {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem 0.75rem;
    padding: 0.625rem 0;
    border-bottom: 1px solid var(--color-border-light);
    font-size: 0.9375rem;
}

.resolved-list li:last-child {
    border-bottom: none;
}

.current-winner {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 0 0 1rem;
    font-weight: 500;
}
</style>
