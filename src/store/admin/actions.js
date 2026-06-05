import queries from './queries';
import { graphqlFetch } from '@/config/api';
import { TOURNAMENTS } from '@/config/tournaments';

export default {
    async fetchAdminData(context) {
        const token = context.rootGetters.token;
        const tournament = TOURNAMENTS.WC2026;

        const response = await graphqlFetch({
            query: `
                query AdminData($tournament: String) {
                    matches(tournament: $tournament) {
                        id
                        homeTeam { id name countryCode }
                        awayTeam { id name countryCode }
                        homeTeamGoals
                        awayTeamGoals
                        startDate
                        hasEnded
                        stage
                    }
                    teams(tournament: $tournament) {
                        id
                        name
                        group
                        countryCode
                        didWin
                    }
                }
            `,
            variables: { tournament },
        }, token);

        const responseData = await response.json();
        if (responseData.errors) {
            throw new Error(responseData.errors[0].message);
        }

        const matches = [...responseData.data.matches].sort(
            (a, b) => new Date(a.startDate) - new Date(b.startDate)
        );
        const teams = [...responseData.data.teams].sort(
            (a, b) => a.name.localeCompare(b.name, 'pl')
        );

        context.commit('setMatches', matches);
        context.commit('setTeams', teams);
    },

    async createMatch(context, payload) {
        const token = context.rootGetters.token;
        const response = await graphqlFetch({
            query: queries.createMatchMutation,
            variables: {
                input: {
                    homeTeamName: payload.homeTeamName,
                    awayTeamName: payload.awayTeamName,
                    stage: payload.stage,
                    date: payload.date,
                },
            },
        }, token);

        const responseData = await response.json();
        if (responseData.errors) {
            throw new Error(responseData.errors[0].message);
        }

        await context.dispatch('fetchAdminData');
    },

    async updateMatchResult(context, payload) {
        const token = context.rootGetters.token;
        const response = await graphqlFetch({
            query: queries.updateMatchResultMutation,
            variables: {
                input: {
                    matchId: payload.matchId,
                    homeTeamGoals: payload.homeTeamGoals,
                    awayTeamGoals: payload.awayTeamGoals,
                },
            },
        }, token);

        const responseData = await response.json();
        if (responseData.errors) {
            throw new Error(responseData.errors[0].message);
        }

        await context.dispatch('fetchAdminData');
    },

    async declareTournamentWinner(context, teamId) {
        const token = context.rootGetters.token;
        const response = await graphqlFetch({
            query: queries.declareTournamentWinnerMutation,
            variables: { teamId },
        }, token);

        const responseData = await response.json();
        if (responseData.errors) {
            throw new Error(responseData.errors[0].message);
        }

        await context.dispatch('fetchAdminData');
    },
};
