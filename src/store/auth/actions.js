// import queries from './queries'

export default {
    async login(context, payload) {
        const graphqlQuery = {
            query: `
                query GetUser($input: UserLoginInput!) {
                    logIn(input: $input) {
                        token
                        userId
                    }
                }   
            `,
            variables: {
                input: {
                    name: payload.username,
                    password: payload.password
                }
            }
        }
        const response = await fetch("https://better-league-service.onrender.com/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(graphqlQuery),
        });

        const responseData = await response.json();

        if (responseData.errors) {
            const error = new Error(
                responseData.errors[0].message || 'Failed to authenticate. Check your login data.'
            );
            throw error;
        }

        localStorage.setItem('token', responseData.data.logIn.token);
        localStorage.setItem('userId', responseData.data.logIn.userId);

        context.commit('setUser', {
            userId: responseData.data.logIn.userId,
            token: responseData.data.logIn.token
        })
    },
    async signup(_, payload) {
        const graphqlQuery = {
            query: `
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
            variables: {
                input: {
                    name: payload.username,
                    password: payload.password,
                    confirmedPassword: payload.confirmPassword
                }
            }
        }
        const response = await fetch("https://better-league-service.onrender.com/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(graphqlQuery),
        });
        const responseData = await response.json();
        if (responseData.errors) {
            const error = new Error(
                responseData.errors[0].message || 'Failed to authenticate. Check your login data.'
            );
            throw error;
        }
    },
    logout(context) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');

        context.commit('setUser', {
            token: null,
            userId: null
        });
    },
    tryLogin(context) {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (token && userId) {
            context.commit('setUser', {
                userId: userId,
                token: token
            })
        }
    }
}