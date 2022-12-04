<template>
	<p-dialog
		header="Recipe tag details"
		:visible="isOpen"
		@show="loadRecipeTagModal"
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
		class="container-modal">
		<article class="p-fluid pt-3">
			<!-- Title Input -->
			<div class="field col-12">
				<div class="p-float-label">
					<p-input-text
						id="recipeTagTitle"
						v-model="validation.title.$model"
						type="text"
						:autofocus="props.recipeTagId == ''"
						:class="{ 'p-invalid': validation.title.$invalid && hasBeenSubmitted }"
						:disabled="hasAssociatedRecipes"
						class="w-full" />
					<label for="recipeTagTitle" :class="{ 'p-error': validation.title.$invalid && hasBeenSubmitted }">Title</label>
				</div>

				<small
					v-if="validation.title.$invalid && hasBeenSubmitted"
					class="p-error">{{ validation.title.required.$message.replace('Value', 'Title') }}</small>
			</div>

			<!-- Description Input -->
			<div class="field col-12">
				<div class="p-float-label">
					<p-textarea id="recipeTagDescription" v-model="validation.description.$model" :autoResize="true" rows="5" cols="30" />
					<label for="recipeTagDescription" :class="{ 'p-error': validation.description.$invalid && hasBeenSubmitted }">Description</label>
				</div>
			</div>

		</article>

		<template #footer>
			<p-button @click="save()" class="p-button-success">
				<fa :icon="['fas', 'check']" size="1x"></fa>
				<span class="ml-2">Save</span>
			</p-button>

			<p-button @click="isVisible = false" class="p-button-text">
				<fa :icon="['fas', 'times']" size="1x"></fa>
				<span class="ml-2">Cancel</span>
			</p-button>
		</template>
	</p-dialog>
</template>

<script setup lang="ts">
import { withDefaults, defineProps, defineEmits, computed, Ref, ref as ref } from "vue"
import { required } from "@vuelidate/validators"
import useVuelidate from "@vuelidate/core"
import { useToast } from "primevue/usetoast"
import RecipeTag from "@/models/recipe/RecipeTag"
import RecipeTagController from "@/controllers/recipes/RecipeTagController"

/* ------------------- Props ----------------- */

interface propsInterface {
	isOpen?: boolean
	recipeTagId: string
}
const props = withDefaults(defineProps<propsInterface>(), {
	isOpen: false,
})

const emit = defineEmits<{
	(event: "change-open-state", isOpen: boolean): void,
	(event: "saved", recipeTag: RecipeTag): string,
}>()


/* ------------------- Properties ----------------- */

const toast = useToast()
const recipeTagController = new RecipeTagController()

/** todo: implementation. Currently will always be disabled for existing recipe tags */
const hasAssociatedRecipes = computed(() => {return recipeTagDetails?.value?.id?.length > 0})

const isVisible = computed({
	get() {
		return props.isOpen
	},
	set(value: boolean) {
		emit("change-open-state", value)
	}
})

const recipeTagDetails: Ref<RecipeTag> = ref(new RecipeTag())

/* ------------------- Validation ----------------- */

const rules = {
	title: { required },
	description: {},
}
const validation = useVuelidate(rules, recipeTagDetails)
const hasBeenSubmitted = ref(false)

/* ------------------- Methods ----------------- */

function changeOpenState(isOpen: boolean) {
	isVisible.value = isOpen
}

async function loadRecipeTagModal() {
	recipeTagDetails.value = await getRecipeTag()
}

async function getRecipeTag(): Promise<RecipeTag> {
	if (props.recipeTagId?.length === 0) {
		return new RecipeTag()
	}

	return recipeTagController.get(props.recipeTagId)
}

async function save() {

	hasBeenSubmitted.value = true
	validation.value.$validate()

	if (validation.value.$error) {
		return
	}

	const isNew: boolean = recipeTagDetails.value.id.length === 0
	const isSaved = isNew ? await addRecipeTag(recipeTagDetails.value) : await updateRecipeTag(recipeTagDetails.value)

	if (isSaved) {
		changeOpenState(false)

		hasBeenSubmitted.value = false

		return emit("saved", recipeTagDetails.value)
	}
}

async function addRecipeTag(recipeTag: RecipeTag) {
	return recipeTagController.add(recipeTag)
		.then(() => {
			toast.add({ severity: "success", summary: "Success", detail: "Successfully added recipe tag", life: 5000 })
			return true
		})
		.catch(error => {
			console.error(`code: ${error.code}\n message: ${error.message}\n stack: ${error.stack}\n`)
			toast.add({ severity: "error", summary: "Error adding recipe tag", detail: `${error}` })
			return false
		})
}

async function updateRecipeTag(recipeTag: RecipeTag) {
	return recipeTagController.update(recipeTag)
		.then(() => {
			toast.add({ severity: "success", summary: "Success", detail: "Successfully updated recipe tag", life: 5000 })
			return true
		})
		.catch(error => {
			console.error(`code: ${error.code}\n message: ${error.message}\n stack: ${error.stack}\n`)
			toast.add({ severity: "error", summary: "Error updating recipe tag", detail: `${error}` })
			return false
		})
}

</script>

<!-- Cannot use scoped here as it won't affect the modal ??????? -->
<style lang="scss">
</style>
