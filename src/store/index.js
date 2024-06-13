import { createStore } from 'vuex';

// import coachesModule from './modules/coaches/index.js';
// import requestsModule from './modules/requests/index.js';
import authModule from './auth/index.js';
import betsModule from './bets/index.js';
import teamsModule from './teams/index.js';
import rankingModule from './ranking/index.js';

const store = createStore({
    modules: {
        auth: authModule,
        bets: betsModule,
        ranking: rankingModule,
        teams: teamsModule
    }
});

export default store;