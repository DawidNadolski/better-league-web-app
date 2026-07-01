export default {
    setMatchDetails(state, payload) {
        state.matchDetails = payload;
    },
    clearMatchDetails(state) {
        state.matchDetails = null;
    },
};
