<template>
	<p-dialog
		header="Feature details"
		:visible="isOpen"
		@update:visible="changeOpenState"
		position="top"
		:displayPosition="true"
		:modal="true"
		:dismissableMask="true"
		:draggable="false"
		:closable="true"
		:auto-z-index="true"
		:base-z-index="100"
		:breakpoints="{ '1080px': '75vw', '640px': '100vw' }"
		class="container-modal"
	>
		<article class="p-fluid pt-3">
			<!-- Title Input -->
			<div class="field col-12">
				<div class="p-float-label">
					<p-input-text
						id="featureTitle"
						v-model="validation.title.$model"
						type="text"
						autofocus
						:class="{ 'p-invalid': validation.title.$invalid && hasBeenSubmitted }"
						class="w-full"
					/>
					<label for="featureTitle" :class="{ 'p-error': validation.title.$invalid && hasBeenSubmitted }">Title</label>
				</div>

				<small
					v-if="validation.title.$invalid && hasBeenSubmitted"
					class="p-error"
				>{{ validation.title.required.$message.replace('Value', 'Title') }}</small>
			</div>

			<!-- Description Input -->
			<div class="field col-12">
				<div class="p-float-label">
					<p-textarea id="featureDescription" v-model="validation.description.$model" :autoResize="true" rows="5" cols="30" autofocus />
					<label for="featureDescription" :class="{ 'p-error': validation.description.$invalid && hasBeenSubmitted }">Description</label>
				</div>
			</div>

			<!-- Priority Input -->
			<div class="field col-12">
				<div class="p-float-label">
					<p-dropdown
						id="featurePriority"
						v-model="validation.priority.$model"
						:options="statuses"
						optionLabel="label"
						optionValue="value"
						placeholder="Select a priority"
					></p-dropdown>
					<label for="featurePriority" :class="{ 'p-error': validation.priority.$invalid && hasBeenSubmitted }"><span v-if="validation.priority.$model != null">Priority</span></label>
				</div>

				<small
					v-if="validation.priority.$invalid && hasBeenSubmitted"
					class="p-error"
				>{{ validation.priority.required.$message.replace('Value', 'Priority') }}</small>
			</div>
		</article>

		<template #footer>
			<p-button label="Save" icon="pi pi-check" @click="saveFeatureRequest()" class="p-button-success" />
			<p-button label="Cancel" icon="pi pi-times" @click="isVisible = false" class="p-button-text" />
		</template>
	</p-dialog>
</template>

<script setup lang="ts">
import firebaseApp from "@/utilities/firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { withDefaults, defineProps, defineEmits, computed, ref, reactive } from 'vue'
import { required } from '@vuelidate/validators'
import useVuelidate from "@vuelidate/core";
import { FirebaseError } from "firebase/app";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import { RouteNames } from "@/router";

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
const auth = getAuth(firebaseApp)
const router = useRouter()


const isVisible = computed({
	get() {
		return props.isOpen
	},
	set(value: boolean) {
		emit("change-open-state", value)
	}
})

const statuses = ref([
	{ label: 'Low', value: 1 },
	{ label: 'Medium', value: 2 },
	{ label: 'High', value: 3 }
]);

const featureRequestDetails = reactive({
	title: "",
	description: "",
	priority: null,
	isConfirmed: false,
})
const rules = {
	title: { required },
	description: {},
	priority: { required },
	isConfirmed: {},
}
const validation = useVuelidate(rules, featureRequestDetails)
const hasBeenSubmitted = ref(false)

/* Methods */

function changeOpenState(isOpen: boolean) {
	isVisible.value = isOpen
}

function saveFeatureRequest() {
	alert("Saved")
}

</script>

<!-- Cannot use scoped here as it won't affect the modal -->
<style lang="scss">
</style>
