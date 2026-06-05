import queries from './queries'
import { graphqlFetch } from '@/config/api';
import { TOURNAMENTS } from '@/config/tournaments';

const GROUP_ORDER = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

function groupTeams(teams) {
    const byGroup = {};
    for (const team of teams) {
        if (!byGroup[team.group]) {
            byGroup[team.group] = [];
        }
        byGroup[team.group].push(team);
    }
    return GROUP_ORDER
        .filter((group) => byGroup[group])
        .map((group) => ({ group, teams: byGroup[group] }));
}

export default {
    async getTeams(context) {
        const teamsQuery = {
            query: queries.getTeamsQuery,
            variables: { tournament: TOURNAMENTS.WC2026 }
        }
        const response = await graphqlFetch(teamsQuery);
        const teamsResponseData = await response.json();
        if (teamsResponseData.errors) {
            const error = new Error(teamsResponseData.errors[0].message)
            throw error;
        }
        const teams = teamsResponseData.data.teams;

        context.commit('setTeams', groupTeams(teams))
    },
    async getWinnerPickStatus(context) {
        const query = {
            query: queries.tournamentHasStartedQuery,
            variables: { tournament: TOURNAMENTS.WC2026 }
        }
        const response = await graphqlFetch(query);
        const responseData = await response.json();
        if (responseData.errors) {
            const error = new Error(responseData.errors[0].message)
            throw error;
        }
        context.commit('setWinnerPickLocked', responseData.data.tournamentHasStarted)
    },
    async getUserTeam(context, userId) {
        const userQuery = {
            query: queries.getUserQuery,
            variables: {
                userId: userId
            }
        }
        const response = await graphqlFetch(userQuery);
        const userResponseData = await response.json();
        if (userResponseData.errors) {
            const error = new Error(userResponseData.errors[0].message)
            throw error;
        }
        const user = userResponseData.data.getUser;
        const winningTeam = user.winningTeam;

        if (winningTeam && winningTeam.tournament === TOURNAMENTS.WC2026) {
            context.commit('setUserTeam', winningTeam.id)
        } else {
            context.commit('setUserTeam', null)
        }
    },
    async updateUserTeam(context, teamId) {
        const token = context.getters.token;
        if (!token) {
            const error = new Error("User not authenticated")
            throw error
        }

        const updateUserTeamMutation = {
            query: queries.updateUserTeamMutation,
            variables: {
                teamId: teamId
            }
        }
        const response = await graphqlFetch(updateUserTeamMutation, token);
        const responseData = await response.json();
        if (responseData.errors) {
            throw new Error(responseData.errors[0].message)
        }
        context.commit('setUserTeam', teamId)
    }
}
