<template>
  <base-dialog :show="!!error" title="Wystąpił błąd!" @close="handleError">
    <p>{{ error }}</p>
  </base-dialog>
  <base-dialog :show="isLoading" title="Pobieranie meczów..." fixed>
    <base-spinner></base-spinner>
  </base-dialog>
  <div>
    <h3 v-if="userBets.length > 0">Nadchodzące mecze</h3>
    <p v-for="userBet in userBets" :key="userBet.id">
      <match-row :userBetData="userBet"></match-row>
    </p>
  </div>
  <div>
    <h3 v-if="resolvedUserBets.length > 0">Wyniki</h3>
    <p v-for="resolvedUserBet in resolvedUserBets" :key="resolvedUserBet.id">
      <bet-row :userBetData="resolvedUserBet"></bet-row>
    </p>
  </div>
</template>

<script>
import MatchRow from "./MatchRow.vue";
import BetRow from "./BetRow.vue";
import BaseDialog from "./BaseDialog.vue";
import BaseSpinner from "./BaseSpinner.vue";

export default {
  components: { MatchRow, BetRow, BaseDialog, BaseSpinner },
  data() {
    return {
      error: null,
      isLoading: false,
    };
  },
  computed: {
    userBets() {
      return this.$store.getters.userBets;
    },
    resolvedUserBets() {
      return this.$store.getters.resolvedUserBets;
    },
  },
  methods: {
    handleError() {
      this.error = null;
      this.$router.replace("/ranking");
    },
  },
  async mounted() {
    this.isLoading = true;
    const userId = this.$store.getters.userId;
    try {
      await this.$store.dispatch("getMatchesAndBets", userId);
    } catch (error) {
      this.error = error;
    }
    this.isLoading = false;
  },
};
</script>