<template>
    <base-dialog :show="isLoading" title="Pobieranie rankingu..." fixed>
        <base-spinner></base-spinner>
    </base-dialog>
    <div class="page">
        <div class="page-header">
            <h1>Euro 2024</h1>
            <p class="subtitle">Ranking końcowy · poprzedni turniej</p>
        </div>
        <ranking-table v-if="usersData.length > 0" :usersData="usersData"></ranking-table>
        <p v-if="errorMessage" class="validation-error">{{ errorMessage }}</p>
    </div>
</template>

<script>
import BaseDialog from "./BaseDialog.vue";
import BaseSpinner from "./BaseSpinner.vue";
import RankingTable from "./RankingTable.vue"
import { TOURNAMENTS } from "@/config/tournaments";

export default {
    components: { BaseDialog, BaseSpinner, RankingTable },
    data() {
        return {
            isLoading: false,
            errorMessage: null
        }
    },
    computed: {
        usersData() {
            return this.$store.getters.usersData;
        }
    },
    async mounted() {
        this.isLoading = true;
        this.errorMessage = null;
        try {
            await this.$store.dispatch("fetchUserData", TOURNAMENTS.EURO2024);
        } catch (error) {
            this.errorMessage = error.message || 'Nie udało się pobrać rankingu Euro 2024.';
        }
        this.isLoading = false;
    }
}
</script>

<style scoped>
.validation-error {
    text-align: center;
    margin-top: 1rem;
}
</style>
