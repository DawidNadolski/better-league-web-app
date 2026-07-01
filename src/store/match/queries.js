export default {
    getMatchDetailsQuery: `
        query GetMatchDetails($matchId: ID!) {
            matchDetails(matchId: $matchId) {
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
                    stage
                }
                summary {
                    exact
                    correct
                    wrong
                    missed
                }
                userBets {
                    userId
                    userName
                    homeTeamGoals
                    awayTeamGoals
                    points
                    status
                }
            }
        }
    `,
};
