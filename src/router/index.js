import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import Dashboard from '@/views/Dashboard.vue'
import Course from '@/views/Course.vue'
import Admin from '@/views/admin/Admin.vue'
import Franchisee from '@/views/admin/Franchisee.vue'
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
      path: '/',
      name: 'default',
      component: Home,
      meta: { auth: { redirect: { name: 'default' }, forbiddenRedirect: '/403' } },
    },
    {
      path: '/admin',
      component: Admin,
      name: 'admin',
      redirect: '/admin/franchisee',
      meta: { auth: { roles: 'administrator', redirect: { name: 'default' }, forbiddenRedirect: '/403' } },
      children: [
        {
          // 当 /user/:id/profile 匹配成功，
          // UserProfile 会被渲染在 User 的 <router-view> 中
          path: 'franchisee',
          redirect: '/admin/franchisee/1',
        },
        {
          // 当 /user/:id/profile 匹配成功，
          // UserProfile 会被渲染在 User 的 <router-view> 中
          name:'franchisee_list',
          path: 'franchisee/:page(\\d+)',
          component: Franchisee
        },
        {
          // 当 /user/:id/posts 匹配成功
          // UserPosts 会被渲染在 User 的 <router-view> 中
          path: 'franchisee/create',
          component:  require('@/views/admin/AddFranchisee.vue').default
        },
        {
          // 当 /user/:id/posts 匹配成功
          // UserPosts 会被渲染在 User 的 <router-view> 中
          name:'franchisee_detail',
          path: 'franchisee/:franchisee_id/school',
          component:  require('@/views/admin/FranchiseeDetail.vue').default
        },
        {
          // 当 /user/:id/posts 匹配成功
          // UserPosts 会被渲染在 User 的 <router-view> 中
          name:'franchisee_add_school',
          path: 'franchisee/:franchisee_id/school/create',
          component:  require('@/views/admin/AddSchool.vue').default
        }
      ]
    },
    {
      path: '/home',
      component: Home,
      name: 'home',
      redirect: '/home/dashboard',
      meta: { auth: { redirect: { name: 'default' }, forbiddenRedirect: '/403' } },
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
      component: Home,
      name: 'employee',
      redirect: '/employee/1',
      meta: { auth: { redirect: { name: 'default' }, forbiddenRedirect: '/403' } },
      children: [
        {
          // 当 /user/:id/profile 匹配成功，
          name:'employee_default',
          path: 'employee',
          redirect: '/employee/1',
        },
        {
          // 当 /user/:id/profile 匹配成功，
          name:'employee_list',
          path: 'employee/:page(\\d+)',
          component: require('@/views/employee/Employee.vue').default
        },
        {
          name:'employee_create',
          path: 'employee/create',
          component: Course
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: require('@/views/Login.vue').default
    },
    {
      path: '*',
      name: '404',
      component: require('@/views/404.vue').default
    },
  ]
})
