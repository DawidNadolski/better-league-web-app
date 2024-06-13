import queries from './queries'

export default {
    async getTeams(context) {
        const teamsQuery = {
            query: queries.getTeamsQuery
        }
        const response = await fetch("https://better-league-service.onrender.com/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(teamsQuery),
        });
        const teamsResponseData = await response.json();
        if (teamsResponseData.errors) {
            const error = new Error(teamsResponseData.errors[0].message)
            throw error;
        }
        const teams = teamsResponseData.data.teams;
        console.log(teams)
        const grouppedTeams = []
        for (const group of ["A", "B", "C", "D", "E", "F"]) {
            const groupTeams = teams.filter((team) => team.group === group)
            grouppedTeams.push({
                group: group,
                teams: groupTeams
            })
        }

        context.commit('setTeams', grouppedTeams)
    },
    async getUserTeam(context, userId) {
        const userQuery = {
            query: queries.getUserQuery,
            variables: {
                userId: userId
            }
        }
        const response = await fetch("https://better-league-service.onrender.com/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userQuery),
        });
        const userResponseData = await response.json();
        if (userResponseData.errors) {
            const error = new Error(userResponseData.errors[0].message)
            throw error;
        }
        const user = userResponseData.data.getUser;

        context.commit('setUserTeam', user.winningTeam.id)
    },
    async updateUserTeam(context, teamId) {
        const token = context.getters.token;
        if (!token) {
            const error = new Error("User not authenticated")
            throw error
        }

        const updateUserTeamMutation = {
            query: queries.updateUserTeamMutation,
            variables: {
                teamId: teamId
            }
        }
        const response = await fetch("https://better-league-service.onrender.com/graphql", {
            method: "POST",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updateUserTeamMutation),
        });
        const responseData = await response.json();
        const user = responseData.data.updateUserTeam;
        console.log(user)
    }
}