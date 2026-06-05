<template>
    <base-dialog :show="!!error" title="Wystąpił błąd!" @close="handleError">
      <p>{{ error }}</p>
    </base-dialog>
    <base-dialog :show="!!error" title="Wystąpił błąd!" @close="handleError">
        <p>{{ error }}</p>
    </base-dialog>
    <h1>Logowanie</h1>
    <base-dialog :show="isLoading" title="Uwierzytelnianie..." fixed>
        <base-spinner></base-spinner>
    </base-dialog>
    <div>
        <div class="form-control">
          <label for="username">Username</label>
          <input type="username" id="username" v-model.trim="username" />
        </div>
        <div class="form-control">
          <label for="password">Password</label>
          <input type="password" id="password" v-model.trim="password" />
        </div>
        <p v-if="!!validationError" class="validationError">
            {{ validationError }}
        </p>
        <button @click="submitLogin">Submit</button>
    </div>
</template>

<script>
import BaseDialog from './BaseDialog.vue';
import BaseSpinner from './BaseSpinner.vue';
export default {
  components: { BaseDialog, BaseSpinner },
    data() {
        return {
            username: '',
            password: '',
            validationError: null,
            error: null,
            isLoading: false
        }
    },
    methods: {
        async submitLogin() {
            if (this.username === '') {
                this.validationError = "Pole nie może być puste!"
                return;
            }
            if (this.password.length < 8) {
                this.validationError = "Hasło powinno mieć conajmniej 8 znaków!"
                return
            }

            this.isLoading = true
            const actionPayload = {
                username: this.username,
                password: this.password
            }
            try {
                await this.$store.dispatch('login', actionPayload);
                this.$router.replace('/matches');
            } catch (err) {
                this.error = err.message || 'Failed to authenticate, try later.';
            }
            this.isLoading = false
        },
        handleError() {
            this.error = null
        }
    }
}
</script>

<style scoped> 
p.validationError {
    color: red;
}
</style>