export default {
    setUser(state, payload) {
        state.userId = payload.userId;
        state.token = payload.token;
        state.userName = payload.userName ?? null;
        state.isAdmin = payload.isAdmin ?? false;
    },
}