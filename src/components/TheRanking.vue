<template>
    <base-dialog :show="isLoading" title="Pobieranie meczów..." fixed>
        <base-spinner></base-spinner>
    </base-dialog>
    <h1>Ranking</h1>
    <ranking-table :usersData="usersData"></ranking-table>
</template>

<script>
import BaseDialog from "./BaseDialog.vue";
import BaseSpinner from "./BaseSpinner.vue";
import RankingTable from "./RankingTable.vue"

export default {
    components: { BaseDialog, BaseSpinner, RankingTable },
    data() {
        return {
            isLoading: false
        }
    },
    computed: {
        usersData() {
            return this.$store.getters.usersData;
        }
    },
    async mounted() {
        console.log('mounted')
        this.isLoading = true;
        try {
            await this.$store.dispatch("fetchUserData");
        } catch (error) {
            console.log(error);
            this.$router.replace("/login");
        }
        this.isLoading = false;
  }
}
</script>