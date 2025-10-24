import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import EvaluatorView from '../views/EvaluatorView.vue';
import DocumentationView from '../views/DocumentationView.vue';
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/evaluator',
            name: 'evaluator',
            component: EvaluatorView
        },
        {
            path: '/documentation',
            name: 'documentation',
            component: DocumentationView
        }
    ],
    scrollBehavior(_to, _from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        }
        else {
            return { top: 0 };
        }
    }
});
export default router;
