import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
//import { verifyAdminPermission } from "./meta";

export enum RouteNames {
	Home = "home",
	About = "about",
	FeatureRequest = "feature-request",
	Recipes = "recipes",
	Settings = "settings",
	ConfirmPasswordReset = "confirm-password-reset",
}

const routes: Array<RouteRecordRaw> = [
	{
		path: "/",
		name: RouteNames.Home,
		component: Home,
	},
	{
		path: "/about",
		name: RouteNames.About,
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: lazyLoad("About"),
	},
	{
		path: "/feature-request",
		name: RouteNames.FeatureRequest,
		component: lazyLoad("FeatureRequest"),
	},
	{
		path: "/recipes",
		name: RouteNames.Recipes,
		component: lazyLoad("Recipes"),
	},
	{
		path: "/settings",
		name: RouteNames.Settings,
		component: lazyLoad("settings/Settings"),
	},
	{
		path: "/confirm-password-reset",
		name: RouteNames.ConfirmPasswordReset,
		component: lazyLoad("settings/ConfirmPasswordReset"),
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

function lazyLoad(viewPath: string) {
	return () => import(`@/views/${viewPath}.vue`)
}

export default router