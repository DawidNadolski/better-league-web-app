export default {
    getUsersQuery: `
        query GetUsers($tournament: String) {
            users(tournament: $tournament) {
                id
                name
                bets {
                    id
                    isResolved
                    points
                }
                winningTeam {
                    id
                    name
                    countryCode
                }
                winnerPoints
                missedBets
            }
        }
    `
}