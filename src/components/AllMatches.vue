<template>
  <base-dialog :show="!!error" title="Wystąpił błąd!" @close="handleError">
    <p>{{ error }}</p>
  </base-dialog>
  <base-dialog :show="isLoading" title="Pobieranie meczów..." fixed>
    <base-spinner></base-spinner>
  </base-dialog>
  <div class="page">
    <div class="page-header">
      <h1>Mecze</h1>
      <p class="subtitle">Typuj wyniki nadchodzących spotkań</p>
    </div>

    <section v-if="userBets.length > 0" class="section">
      <h2 class="section-title">Nadchodzące mecze</h2>
      <div class="card-list">
        <match-row
          v-for="userBet in userBets"
          :key="userBet.id"
          :userBetData="userBet"
        ></match-row>
      </div>
    </section>

    <section v-if="resolvedUserBets.length > 0" class="section">
      <h2 class="section-title">Wyniki</h2>
      <div class="card-list">
        <bet-row
          v-for="resolvedUserBet in resolvedUserBets"
          :key="resolvedUserBet.id"
          :userBetData="resolvedUserBet"
        ></bet-row>
      </div>
    </section>

    <div v-if="userBets.length === 0 && resolvedUserBets.length === 0" class="empty-state card">
      <p>Brak meczów do wyświetlenia.</p>
    </div>
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
    userId() {
      return this.$store.getters.userId;
    },
    userBets() {
      return this.$store.getters.userBets;
    },
    resolvedUserBets() {
      return this.$store.getters.resolvedUserBets;
    },
  },
  watch: {
    userId: {
      async handler(newUserId, oldUserId) {
        if (newUserId && oldUserId && newUserId !== oldUserId) {
          await this.loadMatches(newUserId);
        }
      },
    },
  },
  methods: {
    handleError() {
      this.error = null;
      this.$router.replace("/ranking");
    },
    async loadMatches(userId) {
      this.isLoading = true;
      this.error = null;
      try {
        await this.$store.dispatch("getMatchesAndBets", userId);
      } catch (error) {
        this.error = error;
      }
      this.isLoading = false;
    },
  },
  async mounted() {
    await this.loadMatches(this.userId);
  },
};
</script>

<style scoped>
.section {
  margin-bottom: 2.5rem;
}

.section:last-child {
  margin-bottom: 0;
}
</style>
