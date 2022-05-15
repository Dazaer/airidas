<template>
	<p-dialog
		header="Feature details"
		:visible="isOpen"
		@show="loadFeatureRequestModal"
		@update:visible="changeOpenState"
		position="center"
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
						:autofocus="props.featureRequestId == ''"
						:class="{ 'p-invalid': validation.title.$invalid && hasBeenSubmitted }"
						:disabled="featureRequestDetails.isConfirmed"
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
						:options="priorities"
						optionLabel="label"
						placeholder="Select a priority"
					>
						<template #value="slotProps">
							<div v-if="slotProps.value.id != ''">
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
import { withDefaults, defineProps, defineEmits, computed, Ref, ref as ref } from "vue"
import { required } from "@vuelidate/validators"
import useVuelidate from "@vuelidate/core"
import { useToast } from "primevue/usetoast"
import FeatureRequest from "@/models/feature-requests/FeatureRequest"
import Priority from "@/models/feature-requests/Priority"
import PriorityController from "@/controllers/feature-requests/PriorityController"
import FeatureRequestController from "@/controllers/feature-requests/FeatureRequestController"

/* ------------------- Props ----------------- */

interface propsInterface {
	isOpen?: boolean
	featureRequestId: string
}
const props = withDefaults(defineProps<propsInterface>(), {
	isOpen: false,
})

const emit = defineEmits<{
	(event: "change-open-state", isOpen: boolean): void,
	(event: "saved", featureRequest: FeatureRequest): string,
}>()


/* ------------------- Properties ----------------- */

const toast = useToast()
const featureRequestController = new FeatureRequestController()
const priorityController = new PriorityController()

const isVisible = computed({
	get() {
		return props.isOpen
	},
	set(value: boolean) {
		emit("change-open-state", value)
	}
})

const priorities: Ref<Priority[]> = ref([])
const featureRequestDetails: Ref<FeatureRequest> = ref(new FeatureRequest())

/* ------------------- Validation ----------------- */

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

async function loadFeatureRequestModal() {
	priorities.value = await getPriorities()
	featureRequestDetails.value = await getFeatureRequest()
}

async function getPriorities(): Promise<Priority[]> {
	return priorityController.getAll()
}

async function getFeatureRequest(): Promise<FeatureRequest> {

	if (props.featureRequestId.length === 0) {
		return new FeatureRequest()
	}

	return featureRequestController.get(props.featureRequestId)
}

async function saveFeatureRequest() {
	
	hasBeenSubmitted.value = true
	validation.value.$validate()

	if (validation.value.$error) {
		return
	}

	const isNew: boolean = featureRequestDetails.value.id.length === 0
	const isSaved = isNew ? await addFeatureRequest(featureRequestDetails.value) : await updateFeatureRequest(featureRequestDetails.value)

	if (isSaved) {
		changeOpenState(false)
		
		hasBeenSubmitted.value = false

		return emit("saved", featureRequestDetails.value)
	}
}

async function addFeatureRequest(featureRequest: FeatureRequest) {
	return featureRequestController.add(featureRequest)
		.then(() => {
			toast.add({ severity: "success", summary: "Success", detail: "Successfully added feature request", life: 5000 })
			return true
		})
		.catch(error => {
			console.error(`code: ${error.code}\n message: ${error.message}\n stack: ${error.stack}\n`)
			toast.add({ severity: "error", summary: "Error adding feature request", detail: `${error}` })
			return false
		})
}

async function updateFeatureRequest(featureRequest: FeatureRequest) {
	return featureRequestController.update(featureRequest)
		.then(() => {
			toast.add({ severity: "success", summary: "Success", detail: "Successfully updated feature request", life: 5000 })
			return true
		})
		.catch(error => {
			console.error(`code: ${error.code}\n message: ${error.message}\n stack: ${error.stack}\n`)
			toast.add({ severity: "error", summary: "Error updating feature request", detail: `${error}` })
			return false
		})
}

/* ------------------- Lifecycle ----------------- */
/*
onMounted(async () => {

});
*/

</script>

<!-- Cannot use scoped here as it won't affect the modal -->
<style lang="scss">
</style>
