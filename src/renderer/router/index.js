import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
	
const router = new Router({
	routes: [
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/Login.vue')
        },
        {
            path: '/',
            name: 'home',
            component: () => import('@/views/Home.vue')
        },
	]
});

router.beforeEach((to, from, next) => {
    if (to.fullPath != '/login' && !localStorage.ZOHO_PEOPLE_USERS) {
        next('/login');
    }
    next();
})

export default router;
