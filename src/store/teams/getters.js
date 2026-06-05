export default {
    teams(state) {
        return state.teams;
    },
    userTeam(state) {
        return state.userWinningTeam
    },
    winnerPickLocked(state) {
        return state.winnerPickLocked
    }
}