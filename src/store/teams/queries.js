export default {
    getTeamsQuery: `
        query GetTeams($tournament: String) {
            teams(tournament: $tournament) {
                id
                name
                group
                countryCode
            }
        }
    `,
    getUserQuery: `
        query GetUser($userId: ID!) {
            getUser(userId: $userId) {
                id
                name
                winningTeam {
                    id
                    name
                    tournament
                    countryCode
                }
            }
        }
    `,
    updateUserTeamMutation: `
        mutation UpdateUserTeam($teamId: ID!) {
            updateUserTeam(teamId: $teamId) {
                id
                name
            }
        }
    `,
    tournamentHasStartedQuery: `
        query TournamentHasStarted($tournament: String) {
            tournamentHasStarted(tournament: $tournament)
        }
    `
}