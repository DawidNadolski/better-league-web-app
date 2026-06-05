export default {
    getTeamsQuery: `
        query GetTeams {
            teams {
                id
                name
                group
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
    `
}