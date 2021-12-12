<template>
	<div class="grid grid-nogutter col-12 md:col-8 md:col-offset-2 lg:col-4 lg:col-offset-4">
		<h3 class="col-12 center">Confirm password reset</h3>

		<!-- Main container for password reset -->
		<div class="formgrid grid grid-nogutter col-12 pt-4 box">
			<!-- Confirmation code -->
			<div class="field col-12 p-2">
				<div class="p-float-label">
					<p-input-text
						id="confirmationCode"
						v-model="validation.confirmationCode.$model"
						type="text"
						autofocus
						:class="{ 'p-invalid': validation.confirmationCode.$invalid && hasBeenSubmitted }"
						class="w-full"
					/>

					<label for="confirmationCode" :class="{ 'p-error': validation.confirmationCode.$invalid && hasBeenSubmitted }">Confirmation code:</label>
				</div>

				<div v-if="(validation.confirmationCode.$invalid) && hasBeenSubmitted">
					<small v-for="error of validation.confirmationCode.$errors" :key="error.$uid" class="p-error">{{ error.$message }}</small>
				</div>
			</div>

			<!-- New password -->
			<div class="field col-12 p-2">
				<div class="p-float-label">
					<p-input-text
						id="newPassword"
						v-model="validation.newPassword.$model"
						type="password"
						autofocus
						:class="{ 'p-invalid': validation.newPassword.$invalid && hasBeenSubmitted }"
						class="w-full"
					/>

					<label for="newPassword" :class="{ 'p-error': validation.newPassword.$invalid && hasBeenSubmitted }">New password:</label>
				</div>

				<div v-if="(validation.newPassword.$invalid) && hasBeenSubmitted">
					<small v-for="error of validation.newPassword.$errors" :key="error.$uid" class="p-error">{{ error.$message }}</small>
				</div>
			</div>

			<div class="field col-12 p-2">
				<p-button @click="confirmReset" label="Confirm" class="p-button-success w-full" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import useVuelidate from "@vuelidate/core";
import { required } from '@vuelidate/validators'
import firebaseApp from "@/utilities/firebase";
import { confirmPasswordReset, getAuth } from "firebase/auth";
import { useToast } from "primevue/usetoast";

/* ------------------- Properties ----------------- */
const auth = getAuth(firebaseApp)
const toast = useToast();

/* ------------------- Validation ----------------- */
const passwordResetForm = reactive({
	confirmationCode: "",
	newPassword: "",
})
const rules = {
	confirmationCode: { required },
	newPassword: { required },
}
const validation = useVuelidate(rules, passwordResetForm)
const hasBeenSubmitted = ref(false)

/* ------------------- Methods ----------------- */

function confirmReset() {
	hasBeenSubmitted.value = true
	validation.value.$validate()

	if (validation.value.$error) {
		return
	}

	confirmPasswordReset(auth, passwordResetForm.confirmationCode, passwordResetForm.newPassword)
		.then(() => {
			//password confirmed
			return toast.add({ severity: 'success', summary: "Success", detail: "Successfully changed password", life: 5000 });
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
			return toast.add({ severity: 'error', summary: errorCode, detail: errorMessage, life: 5000 });

		});
}

</script>

<style scoped lang="scss">
.box {
	background-color: var(--surface-e);
	//text-align: center;
	padding-top: 1rem;
	padding-bottom: 1rem;
	border-radius: 4px;
	box-shadow: 2px 6px 4px -1px rgba(0, 0, 0, 0.2),
		0 3px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12);
}
</style>
