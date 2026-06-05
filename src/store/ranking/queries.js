export default {
    getUsersQuery: `
        query GetUsers {
            users {
                id
                name
                bets {
                    id
                    isResolved
                    points
                }
            }
        }
    `
}