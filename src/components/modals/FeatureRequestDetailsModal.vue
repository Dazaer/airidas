<template>
	<p-dialog
		header="Feature details"
		:visible="isOpen"
		@show="loadFeatureDetails"
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
						:autofocus="props.featureRequestId == 0"
						:class="{ 'p-invalid': validation.title.$invalid && hasBeenSubmitted }"
						:disabled="validation.isConfirmed"
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
					<p-textarea id="featureDescription" v-model="validation.description.$model" :autoResize="true" rows="5" cols="30" />
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
						placeholder="Select a priority"
					>
						<template #value="slotProps">
							<div v-if="slotProps.value.id > 0">
								<div>{{ slotProps.value.label }}</div>
							</div>
							<span v-else>{{ slotProps.placeholder }}</span>
						</template>
						<template #option="slotProps">
							<div>
								<div>{{ slotProps.option.label }}</div>
							</div>
						</template>
					</p-dropdown>
					<label for="featurePriority" :class="{ 'p-error': validation.priority.$invalid && hasBeenSubmitted }">
						<span v-if="validation.priority.$model != null">Priority</span>
					</label>
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
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth"
import { withDefaults, defineProps, defineEmits, computed, ref, reactive, onMounted, Ref } from 'vue'
import { required } from '@vuelidate/validators'
import useVuelidate from "@vuelidate/core";
import { FirebaseError } from "firebase/app";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import { RouteNames } from "@/router";
import FeatureRequest from "@/models/FeatureRequest";
import Priority from "@/models/Priority";

/* ------------------- Props ----------------- */

interface propsInterface {
	isOpen?: boolean
	featureRequestId: number
}
const props = withDefaults(defineProps<propsInterface>(), {
	isOpen: false,
});

const emit = defineEmits<{
	(event: 'change-open-state', isOpen: boolean): void,
}>();


/* ------------------- Properties ----------------- */

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

const statuses: Ref<Priority[]> = ref([
	new Priority({ label: 'Low', id: 1 }),
	new Priority({ label: 'Medium', id: 2 }),
	new Priority({ label: 'High', id: 3 }),
]);

const features: Ref<FeatureRequest[]> = ref([
	new FeatureRequest({ "id": 1, "title": "Add a thing", "description": "Orange", "priority": new Priority({ id: 1, label: "Low" }), "isConfirmed": true }),
	new FeatureRequest({ "id": 2, "title": "Change something there", "description": "Black", "priority": new Priority({ id: 1, label: "Low" }), "isConfirmed": true }),
	new FeatureRequest({ "id": 3, "title": "Create a new something", "description": "Gray", "priority": new Priority({ id: 2, label: "Medium" }), "isConfirmed": false }),
	new FeatureRequest({ "id": 4, "title": "Remove the things", "description": "Blue", "priority": new Priority({ id: 3, label: "High" }), "isConfirmed": true }),
	new FeatureRequest({ "id": 5, "title": "If there's one thing that I think should go is the large titles or something else somewhere in this application", "description": "Orange", "priority": new Priority({ id: 2, label: "Medium" }), "isConfirmed": false }),
])

const featureRequestDetails: Ref<FeatureRequest> = ref(new FeatureRequest())
const rules = {
	title: { required },
	description: {},
	priority: { required },
	isConfirmed: {},
}
const validation = useVuelidate(rules, featureRequestDetails)
const hasBeenSubmitted = ref(false)

/* ------------------- Methods ----------------- */

function changeOpenState(isOpen: boolean) {
	isVisible.value = isOpen
}

function loadFeatureDetails() {
	const existingFeatureRequest = features.value.find(feature => feature.id === props.featureRequestId)

	featureRequestDetails.value = existingFeatureRequest ?? new FeatureRequest()
	validation.value.$model = featureRequestDetails.value
}

function saveFeatureRequest() {
	alert("Saved")
}

/* ------------------- Lifecycle ----------------- */
/*
onMounted(async () => {
	const auth = getAuth(firebaseApp);

	const existingFeatureRequest = features.value.find(feature => feature.id === props.featureRequestId)
	featureRequestDetails.value = existingFeatureRequest ?? featureRequestDetails.value
	validation.value.$model = featureRequestDetails.value
});
*/

</script>

<!-- Cannot use scoped here as it won't affect the modal -->
<style lang="scss">
</style>
