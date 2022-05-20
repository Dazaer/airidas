<template>
	<div class="sticky top-0 z-1">
		<p-menubar :model="menu">
			<template #start>
				<router-link to="/">
					<p-button class="p-button-text p-button-text mr-4 home-button">Airidas.net</p-button>
				</router-link>
			</template>

			<!-- This is not complete, but could be expanded on if we ever need to use the exact structure of the MenuModel, but very customized.
			<template #item="{ item }">
				<div v-if="!hasFullyLoaded"></div>

				<span v-else-if="item.to == null">
					<a @click="item.command" role="menuitem" class="p-menuitem-link">
						<span class="p-menuitem-text">{{ item.label }}</span>
					</a>
				</span>

				<router-link v-else :to="item.to ? item.to : null" custom v-slot="{ href, navigate }">
					<a :href="href" @click="navigate" role="menuitem" class="p-menuitem-link">
						<span class="p-menuitem-text">{{ item.label }}</span>
					</a>
				</router-link>
			</template> 
			-->

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
import firebaseApp from "@/utilities/firebase/firebase"
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import LoginModal from "@/views/LoginModal.vue"
import { RouteNames } from "@/router"


const menu = ref([
	/*
	{
		label: "About",
		to: { name: RouteNames.About }
	},
	*/
	{
		label: "Profile",
		items: [
			{ label: "Settings", icon: "fas fa-cog", to: { name: RouteNames.Settings } },
			{ label: "Logout", icon: "fas fa-power-off", command: logout }
		],
		visible: () => isLoggedIn.value,
	},

	{
		label: "Recipes",
		to: { name: RouteNames.Recipes },
		visible: () => isLoggedIn.value,
	},
	/*
	{
		label: "Recipes",
		items: [
			{ label: "Recipes List", icon: "fas fa-utensils", to: { name: RouteNames.Recipes } },
			{ label: "Tags", icon: "fas fa-tags", to: { name: RouteNames.RecipeTags } }
		],
		visible: () => isLoggedIn.value,
	},
	*/

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
])



/* Lifecycle */
onMounted(async () => {
	const auth = getAuth(firebaseApp)

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
	})

	//This happens before the onAuthStateChanged
	//console.log("mounted")
})


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
	const auth = getAuth()

	signOut(auth).then(() => {
		console.log("Successfully signed out")
	}).catch((error) => {
		console.error(error)
		console.error("Error signing out")
	})
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
