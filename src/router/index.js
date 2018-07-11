import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
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
// scrollBehavior:
// - only available in html5 history mode
// - defaults to no scroll behavior
// - return false to prevent scroll
const scrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) {
    // savedPosition is only available for popstate navigations.
    return savedPosition
  } else {
    const position = {}
    // new navigation.
    // scroll to anchor by returning the selector
    if (to.hash) {
      position.selector = to.hash
    }
    // check if any matched route config has meta that requires scrolling to top
    if (to.matched.some(m => m.meta.scrollToTop)) {
      // cords will be used if no selector is provided,
      // or if the selector didn't match any element.
      position.x = 0
      position.y = 0
    }
    // if the returned position is falsy or an empty object,
    // will retain current scroll position.
    return position
  }
}
export default new Router({
  scrollBehavior,
  routes: [
    
    {
      path: '/',
      name: 'default',
      component: Home,
      redirect:'/index',
      meta: { auth: true },
      children: [
        {
          path: '/index',
          name:'index',
          // redirect:'/dashboard',
          component: require('@/views/Default.vue').default
        },
        {
          path: '/dashboard',
          component: require('@/views/Dashboard.vue').default
        },
      ]
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
          name: 'course_list_default',
          path: 'course/list',
          redirect:'/admin/course/list/1',
        },
        {
          name: 'course_list',
          path: 'course/list/:page(\\d+)',
          component: require('@/views/admin/course/CourseList.vue').default
        },
        {
          name: 'course_add',
          path: 'course/create',
          component: require('@/views/admin/course/AddCourse.vue').default
        },
        {
          name: 'course_detail',
          path: 'course/detail',
          component: require('@/views/admin/course/CourseDetail.vue').default
        },
        {
          name: 'product_setting',
          path: 'product/course',
          component: require('@/views/admin/course/CoursePrice.vue').default
        },
        {
          name: 'courseware_setting',
          path: 'courseware/list',
          component: require('@/views/admin/courseware/Courseware.vue').default
        },
        {
          name: 'homework_setting',
          path: 'homework/list',
          component: require('@/views/admin/homework/Homework.vue').default
        }


      ]
    },
    {
      path: '/school',
      name: 'school',
      component: Home,
      meta: { auth: true },
      children: [
        {
          name: 'students',
          path: 'students/:page(\\d+)?',
          component: require('@/views/school/StudentList.vue').default
        },
        {
          name: 'products',
          path: 'classes/:page(\\d+)?',
          component: require('@/views/school/ClazzList.vue').default
        },
        {
          name: 'create_order',
          path: 'purchase/order/create',
          component: require('@/views/school/CreateOrder.vue').default
        },
        {
          name: 'order_list',
          path: 'purchase/order/list/:page(\\d+)?',
          component: require('@/views/school/OrderList.vue').default
        },
        {
          name: 'cashier',
          path: 'purchase/cashier',
          component: require('@/views/school/Cashier.vue').default
        },
        {
          name: 'cashier_result',
          path: 'purchase/cashier/payment/:status',
          component: require('@/views/school/PaymentComplete.vue').default
        },
      ]
    },
    {
      path: '/teaching',
      component: Home,
      name: 'teaching',
      redirect: '/teaching/classroom',
      meta: { auth: { roles: ["teaching_manager", "school_manager", "franchisee_admin", "investor"] } },
      children: [
        {
          // 当 /user/:id/profile 匹配成功，
          // UserProfile 会被渲染在 User 的 <router-view> 中
          name:"classroom",
          path: 'classroom',
          component: require('@/views/teaching_manage/Classroom.vue').default
        },
        {
          name: 'clazz',
          path: 'class/:page(\\d+)?',
          component: require('@/views/teaching_manage/Class.vue').default
        }
      ]
    },
    {
      path: '/home',
      component: Home,
      name: 'homecenter',
      redirect: '/home/employee',
      meta: { auth: { roles: ['franchisee_admin', 'investor'] } },
      children: [
        {
          name: 'employee_list',
          path: 'employee/:page(\\d+)?',
          component: require('@/views/employee/Employee.vue').default
        },
        {
          name: 'employee_create',
          path: 'employee/create',
          component: require('@/views/employee/CreateEmployee.vue').default
        },
        {
          name: 'promotion',
          path: 'promotion/discount',
          component: require('@/views/promotion/Discount.vue').default
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
