import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
//import { verifyAdminPermission } from "./meta";

const routes: Array<RouteRecordRaw> = [
	{
		path: "/",
		name: "Home",
		component: Home,
	},
	{
		path: "/about",
		name: "About",
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () =>
			import(/* webpackChunkName: "about" */ "../views/About.vue"),
	},
	/*
	{
		path: "/user/:userId",
		name: "UserProfile",
		component: UserProfile,
		beforeEnter: (to, _, next) => {
			const id = parseInt(to.params.userId as string);

			if (id > 4 || id < 0) {
				return next({ name: "Home" });
				//can redirect to error page instead
			}
			return next();
		},
				meta: {
			requiresAdmin: true
		}
	},
	*/
];

const router = createRouter({
	history: createWebHistory(),
	routes
});

/*
router.beforeEach((to, from, next) => {
	verifyAdminPermission(to, next);
});
*/

export default router;