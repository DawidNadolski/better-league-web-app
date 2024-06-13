import queries from './queries'

export default {
    async placeBet(context, payload) {
        const token = context.getters.token;
        if (!token) {
            const error = new Error("User not authenticated")
            throw error
        }

        const placeBetQuery = {
            query: queries.placeBetQuery,
            variables: {
                input: {
                    matchId: payload.matchId,
                    homeTeamGoals: payload.homeTeamGoals,
                    awayTeamGoals: payload.awayTeamGoals
                }
            }
        }

        const response = await fetch("https://better-league-service.onrender.com/graphql", {
            method: "POST",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(placeBetQuery),
        });

        const responseData = await response.json();
        if (responseData.errors) {
            const error = new Error(responseData.errors[0].message)
            throw error
        }

        context.commit('updateUserBet', payload)
    },
    async getMatchesAndBets(context, userId) {
        // Fetching matches
        const matchesQuery = {
            query: queries.getMatchesQuery,
        };
        const response = await fetch("https://better-league-service.onrender.com/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(matchesQuery),
        });
        const matchesResponseData = await response.json();
        if (matchesResponseData.errors) {
            const error = new Error(matchesResponseData.errors[0].message)
            throw error;
        }

        const matches = matchesResponseData.data.matches;

        // Fetching user bets
        const betsQuery = {
            query: queries.getUserBetsQuery,
            variables: {
                userId: userId
            },
        };
        const betsResponse = await fetch("https://better-league-service.onrender.com/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(betsQuery),
        });
        const betsResponseData = await betsResponse.json();
        if (betsResponseData.errors) {
            const error = new Error(betsResponseData.errors[0].message)
            throw error;
        }

        const bets = betsResponseData.data.userBets;

        const currentDate = new Date();
        const userBets = []
        const resolvedUserBets = []
        const activeMatches = matches.filter((match) => !match.hasEnded )
        activeMatches.sort((match1, match2) => {
            const match1StartDate = new Date(match1.startDate)
            const match2StartDate = new Date(match2.startDate)
            return match1StartDate - match2StartDate
        })
        const resolvedBets = bets.filter((bet) => bet.isResolved )
        for (const match of activeMatches) {
            const matchBet = bets.find((bet) => bet.match.id === match.id);
            let betHomeTeamGoals = null
            let betAwayTeamGoals = null
            let state = null
            if (matchBet) {
                betHomeTeamGoals = matchBet.homeTeamGoals
                betAwayTeamGoals = matchBet.awayTeamGoals
            }
            const date = new Date(match.startDate);
            if (currentDate < date) {
                state = "upcoming"
            }
            if (currentDate > date && !match.hasEnded) {
                state = "live"
            }
            if (!match.hasEnded) {
                userBets.push({
                    id: match.id,
                    homeTeamName: match.homeTeam.name,
                    homeTeamGoals: match.homeTeamGoals,
                    betHomeTeamGoals: betHomeTeamGoals,
                    awayTeamName: match.awayTeam.name,
                    awayTeamGoals: match.awayTeamGoals,
                    betAwayTeamGoals: betAwayTeamGoals,
                    state: state,
                    startDate: formatDate(date),
                })
            }
        }
        userBets.sort((a, b) => {
            return a.startDate - b.startDate
        })

        for (const bet of resolvedBets) {
            const date = new Date(bet.match.startDate)
            resolvedUserBets.push({
                id: bet.match.id,
                homeTeamName: bet.match.homeTeam.name,
                homeTeamGoals: bet.match.homeTeamGoals,
                betHomeTeamGoals: bet.homeTeamGoals,
                awayTeamName: bet.match.awayTeam.name,
                awayTeamGoals: bet.match.awayTeamGoals,
                betAwayTeamGoals: bet.awayTeamGoals,
                startDate: date.toDateString(),
                points: bet.points
            })
        }
        context.commit('setUserBets', userBets);
        context.commit('setResolvedUserBets', resolvedUserBets);
    }
}

function formatDate(date) {
    const options = {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    };
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return date.toLocaleDateString('pl-PL', options) + " " + hours + ":" + minutes;
}