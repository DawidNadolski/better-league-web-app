import { createApp } from 'vue'

// Router code
import AllMatches from './components/AllMatches.vue';
import AllTeams from './components/AllTeams.vue'
import LogIn from './components/LogIn.vue'
import SignUp from './components/SignUp.vue'
import TheRanking from './components/TheRanking.vue'
import TheEuro2024Ranking from './components/TheEuro2024Ranking.vue'
import TheRules from './components/TheRules.vue'
import TheAdmin from './components/TheAdmin.vue'
import { createRouter, createWebHistory } from 'vue-router';
import store from './store/index.js';

const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', redirect: '/ranking' },
      { path: '/matches', component: AllMatches },
      { path: '/ranking', component: TheRanking },
      { path: '/zasady', component: TheRules },
      { path: '/euro-2024', component: TheEuro2024Ranking },
      { path: '/login', component: LogIn },
      { path: '/signup', component: SignUp },
      { path: '/teams', component: AllTeams },
      {
        path: '/admin',
        component: TheAdmin,
        beforeEnter() {
          if (!store.getters.isAuthenticated || !store.getters.isAdmin) {
            return '/ranking';
          }
        },
      },
    ]
  });

// Store code

import App from './App.vue'
import './assets/styles.css'

const app = createApp(App)
app.use(router)
app.use(store);
app.mount('#app')

