export default {
    createUserQuery: `
        mutation CreateUser($input: UserSignupInput!) {
            createUser(input: $input) {
                id
                name
                bets {
                    id
                    homeTeamGoals
                    awayTeamGoals
                }
            }
        }   
    `,
    getUserQuery: `
        query GetUser($input: UserLoginInput!) {
            logIn(input: $input) {
                token
                userId
            }
        }   
    `
}