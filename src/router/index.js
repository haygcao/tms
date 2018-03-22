import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import Dashboard from '@/views/Dashboard.vue'
import Course from '@/views/Course.vue'
Vue.use(Router)
// const routes=[];
// const files=require.context('./', true, /^\.\/modules\/((?!\/)[\s\S])+\/route\.js$/)
// files.keys().forEach(key => {
//   if (key === './index.js') return
//   routes.push(files(key).default) 
// })
// console.log(JSON.stringify(routes))

export default new Router({
  routes: [
    {
      path: '/home', 
      component: Home,
      name: 'home',
      redirect: '/home/dashboard',
      meta: { auth: true },
      children: [
        {
          // 当 /user/:id/profile 匹配成功，
          // UserProfile 会被渲染在 User 的 <router-view> 中
          path: 'dashboard',
          component: Dashboard
        },
        {
          // 当 /user/:id/posts 匹配成功
          // UserPosts 会被渲染在 User 的 <router-view> 中
          path: 'course',
          component: Course
        }
      ]
    },
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: About
    }
  ]
})
