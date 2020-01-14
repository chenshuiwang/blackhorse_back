import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login.vue'
import Index from '@/views/index.vue'
import Welcome from '../views/welcome.vue'
import Postlist from '../views/postlist.vue'
import PostPublish from '../views/postPublish.vue'
Vue.use(VueRouter)
let router = new VueRouter({
    routes: [
        {
            name:'Login',
            path: '/login',
            component: Login
        },
        {
            name:'Index',
            path: '/index',
            component: Index,
            redirect:{name:'Welcome'},
            children:[
                {
                    name:'Welcome',
                    path:'/welcome',
                    component:Welcome
                },
                {
                    name:'Postlist',
                    path:'postlist',
                    component:Postlist
                },
                {
                    name:'PostPublisht',
                    path:'postPublish',
                    component:PostPublish
                }
            ]
        }
    ]
})
router.beforeEach((to,from,next) => {
    if(to.path === '/login'){
        next()
    }else{
        let token = localStorage.getItem('login_token')
        if(token){
            next()
        }else{
            next('/login')
        }
    }
})
export default router