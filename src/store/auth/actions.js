// import queries from './queries'
import { graphqlFetch } from '@/config/api';

export default {
    async login(context, payload) {
        const graphqlQuery = {
            query: `
                query GetUser($input: UserLoginInput!) {
                    logIn(input: $input) {
                        token
                        userId
                        userName
                        isAdmin
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
        const response = await graphqlFetch(graphqlQuery);

        const responseData = await response.json();

        if (responseData.errors) {
            const error = new Error(
                responseData.errors[0].message || 'Failed to authenticate. Check your login data.'
            );
            throw error;
        }

        localStorage.setItem('token', responseData.data.logIn.token);
        localStorage.setItem('userId', responseData.data.logIn.userId);
        localStorage.setItem('userName', responseData.data.logIn.userName);
        localStorage.setItem('isAdmin', String(responseData.data.logIn.isAdmin));

        context.commit('setUser', {
            userId: responseData.data.logIn.userId,
            token: responseData.data.logIn.token,
            userName: responseData.data.logIn.userName,
            isAdmin: responseData.data.logIn.isAdmin,
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
        const response = await graphqlFetch(graphqlQuery);
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
        localStorage.removeItem('userName');
        localStorage.removeItem('isAdmin');

        context.commit('setUser', {
            token: null,
            userId: null,
            userName: null,
            isAdmin: false,
        });
    },
    tryLogin(context) {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const userName = localStorage.getItem('userName');
        const isAdmin = localStorage.getItem('isAdmin') === 'true';

        if (token && userId) {
            context.commit('setUser', {
                userId: userId,
                token: token,
                userName: userName,
                isAdmin: isAdmin,
            })
        }
    }
}