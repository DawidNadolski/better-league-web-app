export default {
    placeBetQuery: `
        mutation PlaceBet($input: BetInput!) {
            placeBet(input: $input) {
                id
            }
        }
    `,
    getMatchesQuery: `
        query GetMatches {
            matches {
                id
                homeTeam {
                    id
                    name
                }
                homeTeamGoals
                awayTeam {
                    id
                    name
                }
                awayTeamGoals
                startDate
                hasEnded
            }
        }
    `,
    getUserBetsQuery: `
        query GetUserBets($userId: ID!) {
            userBets(userId: $userId) {
                id
                homeTeamGoals
                awayTeamGoals
                match {
                    id
                    homeTeam {
                        name
                    }
                    homeTeamGoals
                    awayTeam {
                        name
                    }
                    awayTeamGoals
                    startDate
                    hasEnded
                }
                isResolved
                points
            }
    }
    `
}