export default {
    setUserBets(state, payload) {
        state.userBets = payload;
    },
    setResolvedUserBets(state, payload) {
        state.resolvedUserBets = payload;
    },
    updateUserBet(state, payload) {
        const updatedBets = state.userBets.map(bet => {
            if (bet.id === payload.matchId) {
                return {
                    ...bet,
                    betHomeTeamGoals: payload.homeTeamGoals,
                    betAwayTeamGoals: payload.awayTeamGoals
                }
            } else {
                return bet
            }
        })
        state.userBets = updatedBets
    }
}