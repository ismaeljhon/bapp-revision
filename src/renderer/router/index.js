import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
	
export default new Router({
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
})
