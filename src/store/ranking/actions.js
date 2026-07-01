import queries from './queries'
import { graphqlFetch } from '@/config/api';

export default {
    async fetchUserData(context, tournament = null) {
        const usersQuery = {
            query: queries.getUsersQuery,
            variables: { tournament }
        }
        const response = await graphqlFetch(usersQuery);
        const usersResponseData = await response.json();
        if (usersResponseData.errors) {
            const error = new Error(usersResponseData.errors[0].message)
            throw error;
        }

        const users = usersResponseData.data.users;
        const usersData = []
        for (const user of users) {
            let exactResults = 0
            let correctResults = 0
            let wrongResults = 0
            let points = 0
            for (const bet of user.bets) {
                if (bet.isResolved) {
                    if (bet.points === 3) {
                        exactResults += 1;
                    } else if (bet.points === 1) {
                        correctResults += 1;
                    } else {
                        wrongResults += 1;
                    }
                    points += bet.points;
                }
            }
            points += user.winnerPoints ?? 0;
            usersData.push({
                userName: user.name,
                exactResults: exactResults,
                correctResults: correctResults,
                wrongResults: wrongResults,
                points: points,
                winningTeamName: user.winningTeam?.name ?? null,
                winningTeamCountryCode: user.winningTeam?.countryCode ?? null,
                pickedWinner: (user.winnerPoints ?? 0) > 0,
                missedBets: user.missedBets ?? 0,
            })
        }
        usersData.sort(function(u1, u2) {
            return u2.points - u1.points
        })

        context.commit('setUsersData', usersData);
    }
}