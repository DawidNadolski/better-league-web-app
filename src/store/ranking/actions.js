import queries from './queries'

export default {
    async fetchUserData(context) {
        const usersQuery = {
            query: queries.getUsersQuery
        }
        const response = await fetch("https://better-league-service.onrender.com/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(usersQuery),
        });
        const usersResponseData = await response.json();
        if (usersResponseData.errors) {
            const error = new Error(usersResponseData.errors[0].message)
            throw error;
        }

        const users = usersResponseData.data.users;
        console.log(users)
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
            usersData.push({
                userName: user.name,
                exactResults: exactResults,
                correctResults: correctResults,
                wrongResults: wrongResults,
                points: points
            })
        }
        usersData.sort(function(u1, u2) {
            return u2.points - u1.points
        })

        context.commit('setUsersData', usersData);
    }
}