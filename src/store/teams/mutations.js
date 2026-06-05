export default {
    setTeams(state, payload) {
        state.teams = payload
    },
    setUserTeam(state, payload) {
        state.userWinningTeam = payload
    },
    setWinnerPickLocked(state, payload) {
        state.winnerPickLocked = payload
    }
}