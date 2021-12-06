<template>
	<p-menubar :model="menu">
		<template #start>
			<router-link to="/">
				<p-button class="p-button-text p-button-text mr-4 home-button">Airidas.net</p-button>
			</router-link>
		</template>
		<!-- <template #end></template> -->
	</p-menubar>

	<LoginModal :is-open="isLoginModalOpen" @change-open-state="changeLoginModalState"></LoginModal>
</template>

<script setup lang="ts">
import { ref } from "vue"
import LoginModal from "./LoginModal.vue";

const menu = ref([
	/*
	{
		label: 'Home',
		icon: "pi pi-home",
		to: "/"
	},
	*/
	{
		label: "About",
		to: { name: "About" }
	},
	{
		label: "Feature Request",
		//to: { name: "feature-request" }
	},
	{
		label: "Login",
		command: () => changeLoginModalState(true),
		disabled: false,
	},
	{
		label: "Profile",
		items: [
			{ label: "Settings", icon: "pi pi-fw pi-cog" /*to: "/settings"*/ },
			{ label: "Logout", icon: "pi pi-fw pi-power-off", command: function () { alert("You have logged out") } }
		]
	},
])

/* Properties */
const isLoginModalOpen = ref(false)

/* Methods */
function changeLoginModalState(isOpening: boolean) {
	isLoginModalOpen.value = isOpening
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

.home-button {
	font-family: "OptimusPrinceps", "Butler";
}

	a {
		color: inherit;
		text-decoration: none;
	}

</style>
