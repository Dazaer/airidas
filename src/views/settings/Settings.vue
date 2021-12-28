<template>
	<div class="grid grid-nogutter col-12 md:col-8 md:col-offset-2 lg:col-4 lg:col-offset-4">
		<h2 class="col-12 center">Settings</h2>

		<!-- Main container for settings -->
		<div class="formgrid grid grid-nogutter col-12 pt-4 container-box">
			<!-- Reset Password with Email -->
			<div class="field col-9 p-2">
				<div class="p-float-label">
					<p-input-text
						id="email"
						v-model="validation.email.$model"
						type="email"
						autofocus
						:disabled="isLoggedIn"
						:class="{ 'p-invalid': validation.email.$invalid && hasBeenSubmitted }"
						class="w-full"
					/>

					<label for="email" :class="{ 'p-error': validation.email.$invalid && hasBeenSubmitted }">Your email:</label>
				</div>

				<div v-if="(validation.email.$invalid) && hasBeenSubmitted">
					<small v-for="error of validation.email.$errors" :key="error.$uid" class="p-error">{{ error.$message }}</small>
				</div>
			</div>

			<div class="field col-3 p-2">
				<p-button @click="resetPassword" label="Reset password" class="p-button-danger w-full center" />
			</div>
		</div>
	</div>

</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import useVuelidate from "@vuelidate/core";
import { email, required } from '@vuelidate/validators'
import firebaseApp from "@/utilities/firebase/firebase";
import { getAuth, onAuthStateChanged, sendPasswordResetEmail } from "firebase/auth";
import { useToast } from "primevue/usetoast";

/* Lifecycle */
onMounted(async () => {
	const auth = getAuth(firebaseApp);

	onAuthStateChanged(auth, (user) => {

		// User is signed in
		if (user) {
			profileForm.email = user.email ?? ""
			isLoggedIn.value = true
		} else {
			profileForm.email = ""
			isLoggedIn.value = false
		}

	});

});

/* ------------------- Properties ----------------- */
const auth = getAuth(firebaseApp)
const toast = useToast();
const isLoggedIn = ref(false)


/* ------------------- Validation ----------------- */
const profileForm = reactive({
	email: "",
})
const rules = {
	email: { required, email },
}
const validation = useVuelidate(rules, profileForm)
const hasBeenSubmitted = ref(false)

/* ------------------- Methods ----------------- */

function resetPassword() {
	hasBeenSubmitted.value = true
	validation.value.$validate()

	if (validation.value.$error) {
		return
	}

	sendPasswordResetEmail(auth, profileForm.email)
		.then(() => {
			return toast.add({ severity: 'success', summary: "Email sent", detail: `A password reset confirmation email has been sent to ${profileForm.email}`, life: 5000 });
		})
		.catch((error) => {
			if (error.code == "auth/user-not-found") {
				return toast.add({ severity: 'error', summary: "User doesn't exist", detail: "The email is not registered within our platform", life: 5000 });
			}

			return toast.add({ severity: 'error', summary: error.code, detail: error.message, life: 5000 });
		});
}

</script>

<style scoped lang="scss">

</style>
