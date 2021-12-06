<template>
	<p-dialog
		header="Login"
		:visible="isOpen"
		@update:visible="changeOpenState"
		position="top"
		:displayPosition="true"
		:modal="true"
		:dismissableMask="true"
		:draggable="false"
		:closable="true"
		:breakpoints="{ '1080px': '75vw', '640px': '100vw' }"
		:style="{ width: '40vw' }"
	>
		<article class="p-fluid pt-3">
			<span class="field grid p-float-label mb-4">
				<p-input-text id="loginEmail" type="email" autofocus v-model="email"/>
				<label for="loginEmail">Email</label>
			</span>

			<span class="field grid p-float-label mb-4">
				<p-input-text id="loginPassword" type="password" v-model="password"/>
				<!-- <p-password id="loginPassword" v-model="password"/> -->
				<label for="loginPassword">Password</label>
			</span>
		</article>

		<div class="grid justify-content-end center">
			<fa :icon="['fas', 'question-circle']" class="text--mini"></fa>
			<p-button label="Help. I forgot my password." class="p-button-link p-button-sm text--mini" />
		</div>

		<template #footer>
			<p-button label="Confirm" icon="pi pi-check" @click="login()"/>
			<p-button label="Cancel" icon="pi pi-times" @click="isVisible = false" class="p-button-text" />
		</template>
	</p-dialog>
</template>

<script setup lang="ts">
import firebaseApp from "@/utilities/firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { withDefaults, defineProps, defineEmits, computed, ref } from 'vue'

interface propsInterface {
	isOpen?: boolean;
}
const props = withDefaults(defineProps<propsInterface>(), {
	isOpen: false,
});

const emit = defineEmits<{
	(event: 'change-open-state', isOpen: boolean): void,
}>();

/* Properties */

const isVisible = computed({
	get() {
		return props.isOpen
	},
	set(value: boolean) {
		emit("change-open-state", value)
	}
})

let email = ref("")
let password = ref("")

/* Methods */
async function login() {
	const auth = getAuth(firebaseApp)

	const userCredentials = await signInWithEmailAndPassword(auth, email.value, password.value)
	.catch((error) => {
		console.error("There was an error logging in: " + error)
	})

	if (!userCredentials) {
		return
	}

	console.log("Successfully signed in: " + userCredentials.user.email)
	changeOpenState(false)
}

function changeOpenState(isOpen: boolean) {
	isVisible.value = isOpen
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

</style>
