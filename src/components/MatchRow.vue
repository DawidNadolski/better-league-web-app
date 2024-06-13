<template>
    <base-dialog :show="!!error" title="Wystąpił błąd!" @close="handleError">
      <p>{{ error }}</p>
    </base-dialog>
    <base-dialog :show="isLoading" title="Typowanie w trakcie..." fixed>
        <base-spinner></base-spinner>
    </base-dialog>
    <div id="bet">
        <p v-if="isActive">Mecz się rozpoczął</p>
        <p>{{ userBetData.startDate }}</p>
        <label for="homeTeamGoals">{{ userBetData.homeTeamName }}</label>
        <input type="number" id="homeTeamGoals" v-model="homeTeamGoals">
        <p> - </p>
        <label for="awayTeamGoals">{{ userBetData.awayTeamName }}</label>
        <input type="number" id="awayTeamGoals" v-model="awayTeamGoals">
    </div>
    <button :disabled="isButtonDisabled" @click="submitBet">Typuj</button>
</template>

<script>
import BaseDialog from './BaseDialog.vue';
import BaseSpinner from './BaseSpinner.vue';

export default {
    components: { BaseDialog, BaseSpinner },
    props: ['userBetData'],
    data() {
        return {
            error: null,
            isLoading: false,
            homeTeamGoals: this.userBetData.betHomeTeamGoals,
            awayTeamGoals: this.userBetData.betAwayTeamGoals
        }
    },
    computed: {
        isBetValid() {
            return (this.homeTeamGoals !== null) && (this.awayTeamGoals !== null)
        },
        isActive() {
            return this.userBetData.state === 'live'
        },
        isButtonDisabled() {
            return this.isActive || !this.isBetValid
        }
    },
    methods: {
        async submitBet() {
            this.isLoading = true
            const payload = {
                matchId: this.userBetData.id,
                homeTeamGoals: this.homeTeamGoals,
                awayTeamGoals: this.awayTeamGoals
            }
            try {
                await this.$store.dispatch('placeBet', payload);
            } catch(error) {
                this.error = error.message;
            }
            this.isLoading = false;
        },
        handleError() {
            this.error = null
        }
    }
}
</script>

<style scoped>
input {
    max-width: 40px;
}
</style>