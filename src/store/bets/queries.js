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
                    countryCode
                }
                homeTeamGoals
                awayTeam {
                    id
                    name
                    countryCode
                }
                awayTeamGoals
                startDate
                hasEnded
                stage
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
                        countryCode
                    }
                    homeTeamGoals
                    awayTeam {
                        name
                        countryCode
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