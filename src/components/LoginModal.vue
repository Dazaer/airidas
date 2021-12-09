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
		:auto-z-index="false"
		:base-z-index="1"
		:breakpoints="{ '1080px': '75vw', '640px': '100vw' }"
		:style="{ width: '40vw' }"
	>
		<article class="p-fluid pt-3">
			<!-- Email Input -->
			<div class="field pb-2">
				<div class="p-float-label">
					<p-input-text
						id="loginEmail"
						v-model="validation.email.$model"
						type="email"
						autofocus
						:class="{ 'p-invalid': validation.email.$invalid && hasBeenSubmitted }"
					/>
					<label
						for="loginEmail"
						:class="{ 'p-error': validation.email.$invalid && hasBeenSubmitted }"
					>Email</label>
				</div>

				<small
					v-if="validation.email.$invalid && hasBeenSubmitted"
					class="p-error"
				>{{ validation.email.required.$message.replace('Value', 'Email') }}</small>
			</div>

			<!-- Password Input -->
			<div class="field">
				<div class="p-float-label">
					<p-input-text
						id="loginPassword"
						v-model="validation.password.$model"
						type="password"
						autofocus
						:class="{ 'p-invalid': validation.password.$invalid && hasBeenSubmitted }"
					/>
					<label
						for="loginPassword"
						:class="{ 'p-error': validation.password.$invalid && hasBeenSubmitted }"
					>Password</label>
				</div>

				<small
					v-if="(validation.password.$invalid || validation.password.$pending) && hasBeenSubmitted"
					class="p-error"
				>{{ validation.password.required.$message.replace('Value', 'Password') }}</small>
			</div>
		</article>

		<div class="grid justify-content-end center">
			<fa :icon="['fas', 'question-circle']" class="text--mini"></fa>
			<p-button label="Help. I forgot my password." class="p-button-link p-button-sm text--mini" />
		</div>

		<template #footer>
			<p-button label="Confirm" icon="pi pi-check" @click="login()" />
			<p-button label="Cancel" icon="pi pi-times" @click="isVisible = false" class="p-button-text" />
		</template>
	</p-dialog>
</template>

<script setup lang="ts">
import firebaseApp from "@/utilities/firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { withDefaults, defineProps, defineEmits, computed, ref, reactive } from 'vue'
import { email, required } from '@vuelidate/validators'
import useVuelidate from "@vuelidate/core";
import { FirebaseError } from "firebase/app";
import { useToast } from "primevue/usetoast";

/* Props */
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
const toast = useToast();

const isVisible = computed({
	get() {
		return props.isOpen
	},
	set(value: boolean) {
		emit("change-open-state", value)
	}
})

const loginForm = reactive({
	email: "",
	password: "",
})
const rules = {
	email: { required },
	password: { required },
}
const validation = useVuelidate(rules, loginForm)
const hasBeenSubmitted = ref(false)

/* Methods */
async function login() {
	hasBeenSubmitted.value = true
	validation.value.$validate()

	if (validation.value.$errors.length > 0) {
		return toast.add({ severity: 'error', summary: 'Form error', detail: "Please correct the invalid fields", life: 3000 });
	}

	const auth = getAuth(firebaseApp)

	const userCredentials = await signInWithEmailAndPassword(auth, loginForm.email, loginForm.password)
		.catch((error: FirebaseError) => {
			console.error("There was an error logging in: " + error)
			return error
		})

	if (userCredentials instanceof FirebaseError) {
		console.warn("code: " + userCredentials.code + "message: " + userCredentials.message + "name: " + userCredentials.name + "customData: " + userCredentials.customData)
		if (userCredentials.code == 'auth/invalid-email') {
			return toast.add({ severity: 'error', summary: 'Invalid login credentials', detail: "The email and password do not match an existing user."});
		}

		return toast.add({ severity: 'error', summary: 'Error logging in', detail: `${userCredentials.code}`, life: 3000 });
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
