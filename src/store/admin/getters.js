export default {
    adminMatches(state) {
        return state.matches;
    },
    adminTeams(state) {
        return state.teams;
    },
    adminUsers(state) {
        return state.users;
    },
    unresolvedMatches(state) {
        return state.matches.filter((match) => !match.hasEnded);
    },
    resolvedMatches(state) {
        return state.matches.filter((match) => match.hasEnded);
    },
    tournamentWinner(state) {
        return state.teams.find((team) => team.didWin) ?? null;
    },
};
