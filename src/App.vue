<template>
		<p-menubar :model="menu">
			<template #start>
				<router-link to="/">
					<p-button class="p-button-text p-button-text mr-4">Airidas.net</p-button>
				</router-link>
			</template>
			<!-- <template #end></template> -->
		</p-menubar>

		<router-view />

		<div>
			<p-button label="PrimeVue" icon="pi pi-user"></p-button>
			<button>regular</button>
			<HelloWorld location="Airidas.net"></HelloWorld>
		</div>
</template>

<script lang="ts" setup>
import { RouterLink } from "vue-router";
import { ref } from "vue"
import HelloWorld from "./components/HelloWorld.vue";

const menu = ref([
	/*
	{
		label: 'Home',
		icon: "pi pi-home",
		to: "/"
	},
	*/
	{
		label: 'About',
		to: { name: "About" }
	},
	{
		label: 'Feature Request',
		//to: { name: "feature-request" }
	},
	{
		label: 'Login',
		//to: { name: "login" },
		disabled: true,
	},
	{
		label: 'Profile',
		items: [
			{ label: "Settings", icon: "pi pi-fw pi-cog" /*to: "/settings"*/ },
			{ label: "Logout", icon: "pi pi-fw pi-power-off", command: function () { alert("You have logged out") } }
		]
	},
]);
</script>

<style lang="scss">
#app {
	//font-family: "Butler", 'Segoe UI', 'Lucida Sans Unicode', Verdana;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	//	font-size: medium;

	//height: 100%;
}

#nav {
	padding: 30px;

	a {
		font-weight: bold;
		color: #2c3e50;

		&.router-link-exact-active {
			color: #42b983;
		}
	}
}
</style>
