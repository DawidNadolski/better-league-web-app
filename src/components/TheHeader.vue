<template>
  <header class="site-header">
    <nav class="nav">
      <div class="nav-start">
        <h1 class="logo">
          <router-link to="/">⚽ Liga typerów</router-link>
        </h1>
        <span class="nav-separator" aria-hidden="true"></span>
        <ul class="nav-archive">
          <li>
            <router-link to="/euro-2024">Euro 2024</router-link>
          </li>
        </ul>
      </div>
      <ul class="nav-links">
        <li v-if="isLoggedIn">
          <router-link to="/matches">Mecze</router-link>
        </li>
        <li>
          <router-link to="/ranking">Ranking</router-link>
        </li>
        <li>
          <router-link to="/zasady">Zasady</router-link>
        </li>
        <li v-if="isLoggedIn">
          <router-link to="/teams">Drużyny</router-link>
        </li>
        <li v-if="isAdmin">
          <router-link to="/admin">Admin</router-link>
        </li>
        <li v-if="!isLoggedIn">
          <router-link to="/login">Zaloguj</router-link>
        </li>
        <li v-if="!isLoggedIn">
          <router-link class="nav-cta" to="/signup">Stwórz konto</router-link>
        </li>
        <li v-if="isLoggedIn">
          <button class="btn btn-ghost" @click="logOut">Wyloguj</button>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
export default {
    computed: {
        isLoggedIn() {
            return this.$store.getters.isAuthenticated;
        },
        isAdmin() {
            return this.$store.getters.isAdmin;
        }
    },
    methods: {
        logOut() {
            this.$store.dispatch('logout')
            this.$router.replace('/ranking')
        }
    }
}
</script>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  height: var(--header-height);
  background: linear-gradient(120deg, var(--color-primary-dark) 0%, var(--color-primary-mid) 55%, #0e7490 100%);
  box-shadow: var(--shadow-lg);
  border-bottom: 1px solid rgba(6, 182, 212, 0.25);
}

.nav {
  width: min(100% - 2rem, 1100px);
  height: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
}

.nav-start {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}

.nav-separator {
  width: 1px;
  height: 1.5rem;
  background: rgba(255, 255, 255, 0.25);
  flex-shrink: 0;
}

.nav-archive {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
}

.nav-archive a {
  text-decoration: none;
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.8125rem;
  font-weight: 500;
  padding: 0.375rem 0.625rem;
  border-radius: var(--radius-sm);
  transition: background 0.15s, color 0.15s;
}

.nav-archive a:hover {
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.08);
}

.nav-archive a.router-link-active {
  color: rgba(255, 255, 255, 0.85);
  background: rgba(255, 255, 255, 0.1);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.15);
}

.logo {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  white-space: nowrap;
}

.logo a {
  color: white;
  text-decoration: none;
}

.logo a:hover,
.logo a.router-link-active {
  opacity: 0.95;
}

.nav-links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
  gap: 0.25rem;
}

.nav-links a {
  text-decoration: none;
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-sm);
  transition: background 0.15s, color 0.15s;
}

.nav-links a:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.nav-links a.router-link-active {
  color: white;
  background: rgba(6, 182, 212, 0.25);
  box-shadow: inset 0 0 0 1px rgba(6, 182, 212, 0.4);
}

.nav-cta {
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-light) 100%) !important;
  color: var(--color-primary-dark) !important;
  font-weight: 700 !important;
  border: none !important;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.35);
}

.nav-links .btn-ghost {
  font-size: 0.875rem;
  padding: 0.5rem 0.875rem;
}

@media (max-width: 640px) {
  .logo {
    font-size: 1rem;
  }

  .nav-separator {
    display: none;
  }

  .nav-archive a,
  .nav-links a,
  .nav-links .btn-ghost {
    font-size: 0.8125rem;
    padding: 0.375rem 0.5rem;
  }
}
</style>
