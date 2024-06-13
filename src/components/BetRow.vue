<template>
    <div :style="{ 'background-color': color}">
        <p>{{ userBetData.startDate }}</p>
        <h4>Wynik</h4>
        <div>
            <p>{{ userBetData.homeTeamName }} {{ userBetData.homeTeamGoals }} - {{ userBetData.awayTeamGoals }} {{ userBetData.awayTeamName }}</p>
        </div>
        
        <h4>Twój typ</h4>
        <p v-if="isBet">{{ userBetData.homeTeamName }} {{ userBetData.betHomeTeamGoals }} - {{ userBetData.betAwayTeamGoals }} {{ userBetData.awayTeamName }}</p>
        <p v-else>Brak</p>
        <p>Punkty: {{ points }}</p>
    </div>
</template>

<script>
export default {
    props: ['userBetData'],
    computed: {
        isBet() {
            return (this.userBetData.betHomeTeamGoals !== null) && (this.userBetData.betAwayTeamGoals !== null)
        },
        result() {
            if (this.userBetData.points === 3) {
                return 'exact'
            } else if (this.userBetData.points === 1) {
                return 'correct'
            } else {
                return 'wrong'
            }
        },
        color() {
            if (this.result === 'exact') {
                return 'green'
            } else if (this.result === 'correct') {
                return 'orange'
            } else {
                return 'red'
            }
        },
        points() {
            if (this.result === 'exact') {
                return 3
            } else if (this.result === 'correct') {
                return 1
            } else {
                return 0
            }
        }
    }
}
</script>