<template>
    <base-dialog :show="!!error" title="Wystąpił błąd!" @close="handleError">
      <p>{{ error }}</p>
    </base-dialog>
    <base-dialog :show="isLoading" title="Pobieranie drużyn..." fixed>
        <base-spinner></base-spinner>
    </base-dialog>
    <h1>Wybierz swoją drużynę</h1>
    <form>
        <fieldset v-for="group in teams" :key="group.group">
            <legend> Grupa {{ group.group }} </legend>
            <div v-for="team in group.teams" :key="team.name">
                <input id="team" type="radio" name="team" :value="team.id" v-model="userTeam" :checked="team.id === userTeam || team.id === initialUserTeam">
                <label for="team.id">
                    {{ team.name }}
                </label>
            </div>
        </fieldset>
        <button @click="submitTeam" type="button">Submit</button>
    </form>
</template>

<script>
import BaseDialog from "./BaseDialog.vue";
import BaseSpinner from "./BaseSpinner.vue";

export default {
  components: { BaseDialog, BaseSpinner },
    data() {
        return {
            error: null,
            isLoading: false,
            userTeam: null
        }
    },
    computed: {
        teams() {
            return this.$store.getters.teams;
        }, 
        initialUserTeam() {
            return this.$store.getters.userTeam;
        }
    },
    methods: {
       async submitTeam() {
            const teamId = this.userTeam;
            console.log(teamId)
            this.isLoading = true;
            try {
                await this.$store.dispatch("updateUserTeam", teamId);
            } catch (error) {
                this.error = error;
            }
            this.isLoading = false;
        },
        handleError() {
            this.error = null
            this.$router.replace("/ranking");
        }
    },
    async mounted() {
        this.isLoading = true;
        try {
            await this.$store.dispatch("getTeams");
        } catch (error) {
            this.error = error.message;
        }

        const userId = this.$store.getters.userId;

        try {
            await this.$store.dispatch("getUserTeam", userId);
        } catch (error) {
            this.error = error.message
        }
        this.isLoading = false;
    }
}
</script>

<style scoped>
fieldset {
    width: 50%;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 20px;
}
</style>