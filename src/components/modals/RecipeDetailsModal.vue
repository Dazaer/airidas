<template>
	<p-dialog
		header="Recipe details"
		:visible="isOpen"
		@show="loadRecipeModal"
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
						id="recipeTitle"
						v-model="validation.title.$model"
						type="text"
						:autofocus="props.recipeId == ''"
						:class="{ 'p-invalid': validation.title.$invalid && hasBeenSubmitted }"
						class="w-full"
					/>
					<label for="recipeTitle" :class="{ 'p-error': validation.title.$invalid && hasBeenSubmitted }">Title</label>
				</div>

				<small
					v-if="validation.title.$invalid && hasBeenSubmitted"
					class="p-error"
				>{{ validation.title.required.$message.replace('Value', 'Title') }}</small>
			</div>

			<!-- Description Input -->
			<div class="field col-12">
				<div class="p-float-label">
					<p-textarea id="recipeDescription" v-model="validation.description.$model" :autoResize="true" rows="5" cols="30" />
					<label for="recipeDescription" :class="{ 'p-error': validation.description.$invalid && hasBeenSubmitted }">Description</label>
				</div>
			</div>

			<!-- Image Link Input -->
			<div class="field col-12">
				<div class="p-float-label">
					<p-input-text
						id="imageLink"
						v-model="validation.imageLink.$model"
						type="text"
						:class="{ 'p-invalid': validation.imageLink.$invalid && hasBeenSubmitted }"
						class="w-full"
					/>
					<label for="imageLink" :class="{ 'p-error': validation.imageLink.$invalid && hasBeenSubmitted }">Image url</label>
				</div>
			</div>
		</article>

		<template #footer>
			<p-button label="Save" icon="pi pi-check" @click="saveRecipe()" class="p-button-success" />
			<p-button label="Cancel" icon="pi pi-times" @click="isVisible = false" class="p-button-text" />
		</template>
	</p-dialog>
</template>

<script setup lang="ts">
import { withDefaults, defineProps, defineEmits, computed, Ref, ref as ref } from 'vue'
import { required } from '@vuelidate/validators'
import useVuelidate from "@vuelidate/core";
import { useToast } from "primevue/usetoast";
import Recipe from "@/models/Recipe";
import RecipeController from "@/controllers/RecipeController";

/* ------------------- Props ----------------- */

interface propsInterface {
	isOpen?: boolean
	recipeId: string
}
const props = withDefaults(defineProps<propsInterface>(), {
	isOpen: false,
});

const emit = defineEmits<{
	(event: 'change-open-state', isOpen: boolean): void,
	(event: 'saved', recipe: Recipe): string,
}>();


/* ------------------- Properties ----------------- */

const toast = useToast();
const recipeController = new RecipeController()

const isVisible = computed({
	get() {
		return props.isOpen
	},
	set(value: boolean) {
		emit("change-open-state", value)
	}
})

const recipeDetails: Ref<Recipe> = ref(new Recipe())

/* ------------------- Validation ----------------- */

const rules = {
	title: { required },
	description: {},
	imageLink: {},
}
const validation = useVuelidate(rules, recipeDetails)
const hasBeenSubmitted = ref(false)

/* ------------------- Methods ----------------- */

function changeOpenState(isOpen: boolean) {
	isVisible.value = isOpen
}

async function loadRecipeModal() {
	recipeDetails.value = await getRecipe()
}

async function getRecipe(): Promise<Recipe> {

	if (props.recipeId.length === 0) {
		return new Recipe()
	}

	return recipeController.get(props.recipeId)
}

async function saveRecipe() {

	hasBeenSubmitted.value = true
	validation.value.$validate()

	if (validation.value.$error) {
		return
	}

	const isNew: boolean = recipeDetails.value.id.length === 0
	const isSaved = isNew ? await addRecipe(recipeDetails.value) : await updateRecipe(recipeDetails.value)

	if (isSaved) {
		changeOpenState(false)

		hasBeenSubmitted.value = false

		return emit("saved", recipeDetails.value)
	}
}

async function addRecipe(recipe: Recipe) {
	return recipeController.add(recipe)
		.then(value => {
			toast.add({ severity: 'success', summary: "Success", detail: `Successfully added recipe`, life: 5000 });
			return true
		})
		.catch(error => {
			console.error(`code: ${error.code}\n message: ${error.message}\n stack: ${error.stack}\n`)
			toast.add({ severity: 'error', summary: "Error adding recipe", detail: `${error}` });
			return false
		})
}

async function updateRecipe(recipe: Recipe) {
	return recipeController.update(recipe)
		.then(value => {
			toast.add({ severity: 'success', summary: "Success", detail: `Successfully updated recipe`, life: 5000 });
			return true
		})
		.catch(error => {
			console.error(`code: ${error.code}\n message: ${error.message}\n stack: ${error.stack}\n`)
			toast.add({ severity: 'error', summary: "Error updating recipe", detail: `${error}` });
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
