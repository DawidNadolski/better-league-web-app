import queries from './queries'
import { graphqlFetch } from '@/config/api';
import { formatMatchDate } from '@/utils/formatMatchDate';

export default {
    async placeBet(context, payload) {
        const token = context.getters.token;
        if (!token) {
            const error = new Error("User not authenticated")
            throw error
        }

        const placeBetQuery = {
            query: queries.placeBetQuery,
            variables: {
                input: {
                    matchId: payload.matchId,
                    homeTeamGoals: payload.homeTeamGoals,
                    awayTeamGoals: payload.awayTeamGoals
                }
            }
        }

        const response = await graphqlFetch(placeBetQuery, token);

        const responseData = await response.json();
        if (responseData.errors) {
            const error = new Error(responseData.errors[0].message)
            throw error
        }

        context.commit('updateUserBet', payload)
    },
    async getMatchesAndBets(context, userId) {
        if (!userId) {
            context.commit('setUserBets', []);
            context.commit('setResolvedUserBets', []);
            return;
        }

        // Fetching matches
        const matchesQuery = {
            query: queries.getMatchesQuery,
        };
        const response = await graphqlFetch(matchesQuery);
        const matchesResponseData = await response.json();
        if (matchesResponseData.errors) {
            const error = new Error(matchesResponseData.errors[0].message)
            throw error;
        }

        const matches = matchesResponseData.data.matches;

        // Fetching user bets
        const betsQuery = {
            query: queries.getUserBetsQuery,
            variables: {
                userId: userId
            },
        };
        const betsResponse = await graphqlFetch(betsQuery);
        const betsResponseData = await betsResponse.json();
        if (betsResponseData.errors) {
            const error = new Error(betsResponseData.errors[0].message)
            throw error;
        }

        const bets = betsResponseData.data.userBets;

        const currentDate = new Date();
        const userBets = []
        const resolvedUserBets = []
        const activeMatches = matches.filter((match) => !match.hasEnded )
        activeMatches.sort((match1, match2) => {
            const match1StartDate = new Date(match1.startDate)
            const match2StartDate = new Date(match2.startDate)
            return match1StartDate - match2StartDate
        })
        const endedMatches = matches.filter((match) => match.hasEnded)
        endedMatches.sort(
            (a, b) => new Date(b.startDate) - new Date(a.startDate)
        )
        for (const match of activeMatches) {
            const matchBet = bets.find(
                (bet) => bet.match && String(bet.match.id) === String(match.id)
            );
            let betHomeTeamGoals = null
            let betAwayTeamGoals = null
            let state = null
            if (matchBet) {
                betHomeTeamGoals = matchBet.homeTeamGoals
                betAwayTeamGoals = matchBet.awayTeamGoals
            }
            const date = new Date(match.startDate);
            if (currentDate < date) {
                state = "upcoming"
            }
            if (currentDate > date && !match.hasEnded) {
                state = "live"
            }
            if (!match.hasEnded) {
                userBets.push({
                    id: match.id,
                    homeTeamName: match.homeTeam.name,
                    homeTeamCountryCode: match.homeTeam.countryCode,
                    homeTeamGoals: match.homeTeamGoals,
                    betHomeTeamGoals: betHomeTeamGoals,
                    awayTeamName: match.awayTeam.name,
                    awayTeamCountryCode: match.awayTeam.countryCode,
                    awayTeamGoals: match.awayTeamGoals,
                    betAwayTeamGoals: betAwayTeamGoals,
                    state: state,
                    startDate: formatMatchDate(date),
                    stage: match.stage,
                })
            }
        }

        for (const match of endedMatches) {
            const matchBet = bets.find(
                (bet) => bet.match && String(bet.match.id) === String(match.id)
            );
            resolvedUserBets.push({
                id: match.id,
                homeTeamName: match.homeTeam.name,
                homeTeamCountryCode: match.homeTeam.countryCode,
                homeTeamGoals: match.homeTeamGoals,
                betHomeTeamGoals: matchBet ? matchBet.homeTeamGoals : null,
                awayTeamName: match.awayTeam.name,
                awayTeamCountryCode: match.awayTeam.countryCode,
                awayTeamGoals: match.awayTeamGoals,
                betAwayTeamGoals: matchBet ? matchBet.awayTeamGoals : null,
                startDate: formatMatchDate(new Date(match.startDate)),
                stage: match.stage,
                points: matchBet ? matchBet.points : 0,
            })
        }
        context.commit('setUserBets', userBets);
        context.commit('setResolvedUserBets', resolvedUserBets);
    }
}
