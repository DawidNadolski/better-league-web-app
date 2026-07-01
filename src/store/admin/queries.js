export default {
    getMatchesQuery: `
        query GetMatches($tournament: String) {
            matches(tournament: $tournament) {
                id
                homeTeam {
                    id
                    name
                    countryCode
                }
                awayTeam {
                    id
                    name
                    countryCode
                }
                homeTeamGoals
                awayTeamGoals
                startDate
                hasEnded
                stage
                tournament
            }
        }
    `,
    getTeamsQuery: `
        query GetTeams($tournament: String) {
            teams(tournament: $tournament) {
                id
                name
                group
                countryCode
                didWin
            }
        }
    `,
    createMatchMutation: `
        mutation CreateMatch($input: MatchInput!) {
            createMatch(input: $input) {
                id
                stage
                startDate
                hasEnded
            }
        }
    `,
    updateMatchResultMutation: `
        mutation UpdateMatchResult($input: MatchResultInput!) {
            updateMatchResult(input: $input) {
                id
                homeTeamGoals
                awayTeamGoals
                hasEnded
            }
        }
    `,
    declareTournamentWinnerMutation: `
        mutation DeclareTournamentWinner($teamId: ID!) {
            declareTournamentWinner(teamId: $teamId) {
                id
                name
                didWin
            }
        }
    `,
    adminUsersQuery: `
        query AdminUsers {
            adminUsers {
                id
                name
            }
        }
    `,
    adminResetUserPasswordMutation: `
        mutation AdminResetUserPassword($input: AdminResetPasswordInput!) {
            adminResetUserPassword(input: $input) {
                id
                name
            }
        }
    `,
    adminPlaceUserBetMutation: `
        mutation AdminPlaceUserBet($input: AdminPlaceBetInput!) {
            adminPlaceUserBet(input: $input) {
                id
                homeTeamGoals
                awayTeamGoals
                isResolved
                points
            }
        }
    `,
};
