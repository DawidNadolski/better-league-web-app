<template>
    <base-dialog :show="!!error" title="Wystąpił błąd!" @close="handleError">
      <p>{{ error }}</p>
    </base-dialog>
    <base-dialog :show="isLoading" title="Tworzenie użytkownika..." fixed>
        <base-spinner></base-spinner>
    </base-dialog>
    <div class="page">
        <div class="page-header">
            <h1>Rejestracja</h1>
            <p class="subtitle">Dołącz do ligi typerów</p>
        </div>
        <div class="card form-card">
            <div class="form-control">
              <label for="username">Nick</label>
              <input type="text" id="username" v-model.trim="username" autocomplete="username" />
            </div>
            <div class="form-control">
              <label for="password">Hasło</label>
              <input type="password" id="password" v-model.trim="password" autocomplete="new-password" />
            </div>
            <div class="form-control">
              <label for="confirmPassword">Potwierdź hasło</label>
              <input type="password" id="confirmPassword" v-model.trim="confirmPassword" autocomplete="new-password" />
            </div>
            <p v-if="!!validationError" class="validation-error">
                {{ validationError }}
            </p>
            <button class="btn btn-primary form-submit" @click="submitSignup">Stwórz konto</button>
            <p class="form-footer">
                Masz już konto?
                <router-link to="/login">Zaloguj się</router-link>
            </p>
        </div>
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

<style scoped>
.form-submit {
    width: 100%;
    margin-top: 0.5rem;
}

.form-footer {
    margin: 1.25rem 0 0;
    text-align: center;
    font-size: 0.875rem;
    color: var(--color-text-muted);
}

.form-footer a {
    color: var(--color-primary-mid);
    font-weight: 600;
    text-decoration: none;
}

.form-footer a:hover {
    text-decoration: underline;
}
</style>
