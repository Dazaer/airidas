<template>
	<div class="sticky top-0 z-1">
		<p-menubar :model="menu">
			<template #start>
				<router-link to="/">
					<p-button class="p-button-text p-button-text mr-4 home-button">Airidas.net</p-button>
				</router-link>
			</template>

			<template v-if="!hasFullyLoaded" #item></template>

			<template v-if="isLoggedIn" #end>
				<p class="center-right text--mini">Logged in as: {{ loggedInEmail }}</p>
			</template>
		</p-menubar>

		<p-progress-bar v-if="!hasFullyLoaded" mode="indeterminate" />
	</div>

	<LoginModal :is-open="isLoginModalOpen" @change-open-state="changeLoginModalState"></LoginModal>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import firebaseApp from "@/utilities/firebase/firebase";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import LoginModal from "./LoginModal.vue";
import { RouteNames } from "@/router";


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
		to: { name: RouteNames.About }
	},
	{
		label: "Feature Request",
		to: { name: "feature-request" },
		visible: () => isLoggedIn.value,
	},
	{
		key: "placeholder-login-key",
		label: "Login",
		command: () => changeLoginModalState(true),
		visible: () => !isLoggedIn.value,
	},
	{
		label: "Profile",
		items: [
			{ label: "Settings", icon: "pi pi-fw pi-cog", to: { name: RouteNames.Settings } },
			{ label: "Logout", icon: "pi pi-fw pi-power-off", command: logout }
		],
		visible: () => isLoggedIn.value,
	},
])



/* Lifecycle */
onMounted(async () => {
	const auth = getAuth(firebaseApp);

	onAuthStateChanged(auth, (user) => {

		// User is signed in
		if (user) {
			loggedInEmail.value = user.email ?? "no email"
			isLoggedIn.value = true
			console.log("logged in")
		} else {
			loggedInEmail.value = ""
			isLoggedIn.value = false
			console.log("logged out")
		}

		hasFullyLoaded.value = true
	});

	//This happens before the onAuthStateChanged
	//console.log("mounted")
});


/* Properties */
const isLoginModalOpen = ref(false)
const loggedInEmail = ref("")
const isLoggedIn = ref(false)
const hasFullyLoaded = ref(false)


/* Methods */
function changeLoginModalState(isOpening: boolean) {
	isLoginModalOpen.value = isOpening
}

function logout() {
	const auth = getAuth();

	signOut(auth).then(() => {
		console.log("Successfully signed out")
	}).catch((error) => {
		console.error("Error signing out")
	});
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
