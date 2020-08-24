import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */'components/common/Login')
const Home = () =>  import(/* webpackChunkName: "login_home_welcome" */'views/home/Home')
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */'components/content/Welcome')
const Users = () => import(/* webpackChunkName: "users_rights_roles" */'views/user/Users')
const Rights = () => import (/* webpackChunkName: "users_rights_roles" */'views/power/Rights')
const Roles = () => import(/* webpackChunkName: "users_rights_roles" */'views/power/Roles')
const Cate = () => import(/* webpackChunkName: "cate_params" */'views/goods/Cate')
const Params = () => import(/* webpackChunkName: "cate_params" */'views/goods/Params')
const GoodsList = () => import(/* webpackChunkName: "goodslist_add" */'views/goods/List')
const Add = () => import(/* webpackChunkName: "goodslist_add" */'views/goods/Add')
const Order = () => import(/* webpackChunkName: "order_report" */'views/order/Order')
const Report = () => import(/* webpackChunkName: "order_report" */'views/report/Report')
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
		{
			path: '/',
			redirect: '/login'
		},
		{
			path: '/login',
			component: Login
		},
		{
			path: '/home',
			component: Home,
			redirect: '/welcome',
			children: [
				{path: '/welcome', component: Welcome},
				{path: '/users', component: Users},
				{path: '/rights', component: Rights},
				{path: '/Roles', component: Roles},
				{path: '/categories', component: Cate},
				{path: '/params', component: Params},
				{path: '/goods', component: GoodsList},
				{path: '/goods/add', component: Add},
				{path: '/orders', component: Order},
				{path: '/reports', component: Report}
			]
		}
	]
})

router.beforeEach((to, from, next) => {
	if(to.path === '/login') return next()
	const tokenStr = window.sessionStorage.getItem('token')
	if(!tokenStr) return next('/login')
	next()
})

export default router
