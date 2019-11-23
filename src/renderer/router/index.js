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
            path: '/loginV1',
            name: 'loginV1',
            component: require('@/views/LoginV1').default
        },
        {
            path: '/',
            name: 'home',
            component: require('@/views/Home').default
        },
	]
});

router.beforeEach((to, from, next) => {
    if (to.fullPath != '/loginV1' && (!localStorage.ZOHO_CURRENT_USER_V1 || !localStorage.ZOHO_ACCESS_TOKEN_V1)) {
        next('/loginV1');
    }
    next();
})

export default router;
