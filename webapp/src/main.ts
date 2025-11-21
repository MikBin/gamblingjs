import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'

import HomeView from './views/HomeView.vue'
import EvaluatorView from './views/EvaluatorView.vue'
import DocumentationView from './views/DocumentationView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/evaluator', component: EvaluatorView },
    { path: '/docs', component: DocumentationView }
  ]
})

const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)
app.mount('#app')
