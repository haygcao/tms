import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
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
      meta: { auth: true },
    },
    {
      path: '/admin',
      component: Admin,
      name: 'admin',
      redirect: '/admin/franchisee',
      meta: { auth: { roles: ['administrator'] } },
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
          name: 'franchisee_list',
          path: 'franchisee/:page(\\d+)',
          component: Franchisee
        },
        {
          // 当 /user/:id/posts 匹配成功
          // UserPosts 会被渲染在 User 的 <router-view> 中
          path: 'franchisee/create',
          component: require('@/views/admin/AddFranchisee.vue').default
        },
        {
          // 当 /user/:id/posts 匹配成功
          // UserPosts 会被渲染在 User 的 <router-view> 中
          name: 'franchisee_detail',
          path: 'franchisee/:franchisee_id/school',
          component: require('@/views/admin/FranchiseeDetail.vue').default
        },
        {
          // 当 /user/:id/posts 匹配成功
          // UserPosts 会被渲染在 User 的 <router-view> 中
          name: 'franchisee_add_school',
          path: 'franchisee/:franchisee_id/school/create',
          component: require('@/views/admin/AddSchool.vue').default
        },
        {
          name: 'course_add',
          path: 'course/create',
          component: require('@/views/admin/AddCourse.vue').default
        }

      ]
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { auth: true },
      children: [
        {
          path: 'dashboard',
          component: require('@/views/Dashboard.vue').default
        },
      ]
    },
    {
      path: '/school',
      name: 'school',
      component: Home,
      meta: { auth: true },
      children: [
        {
          name:'students',
          path: 'students/:page(\\d+)',
          component: require('@/views/school/StudentList.vue').default
        },
        {
          name:'products',
          path: 'classes/:page(\\d+)',
          component: require('@/views/school/ClazzList.vue').default
        },
        {
          name:'create_order',
          path: 'purchase/order/create',
          component: require('@/views/school/CreateOrder.vue').default
        },
        {
          name:'order_list',
          path: 'purchase/order/list/:page(\\d+)',
          component: require('@/views/school/OrderList.vue').default
        },
        {
          name:'cashier',
          path: 'purchase/cashier',
          component: require('@/views/school/Cashier.vue').default
        },
      ]
    },
    {
      path: '/teaching',
      component: Home,
      name: 'teaching',
      redirect: '/classroom',
      meta: { auth: { roles: ["teaching_manager", "school_manager", "administrator", "franchisee_admin", "investor"] } },
      children: [
        {
          // 当 /user/:id/profile 匹配成功，
          // UserProfile 会被渲染在 User 的 <router-view> 中
          path: 'classroom',
          component: require('@/views/teaching_manage/Classroom.vue').default
        },
        {
          name: 'clazz_default',
          path: 'class',
          redirect: '/teaching/class/1',
        },
        {
          name: 'clazz',
          path: 'class/:page(\\d+)',
          component: require('@/views/teaching_manage/Class.vue').default
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
      path: '/home',
      component: Home,
      name: 'employee',
      redirect: '/employee',
      meta: { auth: { roles: ['administrator', 'franchisee_admin', 'investor'] } },
      children: [
        {
          // 当 /user/:id/profile 匹配成功，
          name: 'employee_list',
          path: 'employee',
          component: require('@/views/employee/Employee.vue').default
        },
        {
          name: 'employee_create',
          path: 'employee/create',
          component: require('@/views/employee/CreateEmployee.vue').default
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: require('@/views/Login.vue').default
    },
    {
      path: '/403',
      name: '403',
      component: require('@/views/403.vue').default
    },
    {
      path: '*',
      name: '404',
      component: require('@/views/404.vue').default
    },
  ]
})
