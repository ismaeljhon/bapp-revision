import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
	
const router = new Router({
	routes: [
        {
            path: '/login',
            name: 'login',
            component: require('@/views/Login').default
        },
        {
            path: '/',
            name: 'home',
            component: require('@/views/Home').default
        },
	]
});

router.beforeEach((to, from, next) => {
    if (to.fullPath != '/login' && !localStorage.ZOHO_EMAIL) {
        next('/login');
    }
    next();
})

export default router;
