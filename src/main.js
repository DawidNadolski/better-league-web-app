import { createApp } from 'vue'

// Router code
import AllMatches from './components/AllMatches.vue';
import AllTeams from './components/AllTeams.vue'
import LogIn from './components/LogIn.vue'
import SignUp from './components/SignUp.vue'
import TheRanking from './components/TheRanking.vue'
import { createRouter, createWebHistory } from 'vue-router';
const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', redirect: '/ranking' },
      { path: '/matches', component: AllMatches },
      { path: '/ranking', component: TheRanking },
      { path: '/login', component: LogIn },
      { path: '/signup', component: SignUp },
      { path: '/teams', component: AllTeams }
    ]
  });

// Store code
import store from './store/index.js';

import App from './App.vue'

const app = createApp(App)
app.use(router)
app.use(store);
app.mount('#app')

