export default {
    userId(state) {
        return state.userId;
    },
    token(state) {
        return state.token;
    },
    isAuthenticated(state) {
        return !!state.token;
    },
    userName(state) {
        return state.userName;
    },
    isAdmin(state) {
        return state.isAdmin;
    },
}