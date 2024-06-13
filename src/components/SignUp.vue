<template>
    <base-dialog :show="!!error" title="Wystąpił błąd!" @close="handleError">
      <p>{{ error }}</p>
    </base-dialog>
    <base-dialog :show="isLoading" title="Tworzenie użytkownika..." fixed>
        <base-spinner></base-spinner>
    </base-dialog>
    <h1>Rejestracja</h1>
    <div>
        <div class="form-control">
          <label for="username">Username</label>
          <input type="username" id="username" v-model.trim="username" />
        </div>
        <div class="form-control">
          <label for="password">Password</label>
          <input type="password" id="password" v-model.trim="password" />
        </div>
        <div class="form-control">
          <label for="confirmPassword">Confirm password</label>
          <input type="password" id="confirmPassword" v-model.trim="confirmPassword" />
        </div>
        <p v-if="!!validationError">
            {{ validationError }}
        </p>
        <button @click="submitSignup">Submit</button>
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
            confirmPassword: '',
            isLoading: false,
            error: null,
            validationError: null
        }
    },
    methods: {
        async submitSignup() {
            if (this.username === '') {
                this.validationError = "Pole nie może być puste!"
                return;
            }
            if (this.password.length < 8) {
                this.validationError = "Hasło powinno mieć conajmniej 8 znaków!"
                return
            }
            if (this.password !== this.confirmPassword) {
                this.validationError = "Podane hasła różnią się od siebie!"
                return
            }

            this.isLoading = true
            const actionPayload = {
                username: this.username,
                password: this.password,
                confirmPassword: this.confirmPassword
            }
            try {
                await this.$store.dispatch('signup', actionPayload);
                this.$router.replace('/login');
            } catch (err) {
                this.error = err.message || 'Nie udało się stworzyć użytkownika, spróbuj jeszcze raz!';
            }
            this.isLoading = false
        },
        handleError() {
            this.error = null
        }
    }
}
</script>