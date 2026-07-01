import queries from './queries';
import { graphqlFetch } from '@/config/api';

export default {
    async fetchMatchDetails(context, matchId) {
        const token = context.rootGetters.token;
        if (!token) {
            throw new Error('User not authenticated');
        }

        const matchDetailsQuery = {
            query: queries.getMatchDetailsQuery,
            variables: { matchId },
        };

        const response = await graphqlFetch(matchDetailsQuery, token);
        const responseData = await response.json();

        if (responseData.errors) {
            throw new Error(responseData.errors[0].message);
        }

        context.commit('setMatchDetails', responseData.data.matchDetails);
    },
    clearMatchDetails(context) {
        context.commit('clearMatchDetails');
    },
};
