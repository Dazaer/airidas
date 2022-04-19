<template>
	<p-dialog
		header="Recipe Details"
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
		class="container-modal">
		<article class="p-fluid pt-3">
			<!-- Title Input -->
			<div class="field col-12">
				<div v-if="canEdit">
					<div class="p-float-label">
						<p-input-text
							id="recipeTitle"
							v-model="validation.title.$model"
							type="text"
							:autofocus="props.recipeId == ''"
							:class="{ 'p-invalid': validation.title.$invalid && hasBeenSubmitted }"
							class="w-full" />
						<label for="recipeTitle" :class="{ 'p-error': validation.title.$invalid && hasBeenSubmitted }">Title</label>
					</div>

					<small
						v-if="validation.title.$invalid && hasBeenSubmitted"
						class="p-error">{{ validation.title.required.$message.replace('Value', 'Title') }}
					</small>
				</div>
				<div v-else>
					<label for="recipeTitle" class="text--mini text--darker">Title</label>
					<p id="recipeTitle">{{ validation.title.$model }}</p>
				</div>
			</div>

			<!-- Description Input -->
			<div class="field col-12">
				<div v-if="canEdit" class="p-float-label">
					<p-textarea id="recipeDescription" v-model="validation.description.$model" :autoResize="true" rows="5" cols="30" />
					<label for="recipeDescription" :class="{ 'p-error': validation.description.$invalid && hasBeenSubmitted }">Description</label>
				</div>
				<div v-else>
					<label for="recipeDescription" class="text--mini text--darker">Description</label>
					<p id="recipeDescription">{{ validation.description.$model }}</p>
				</div>
			</div>

			<!-- Recipe Url Input -->
			<div v-if="canEdit" class="field col-12">
				<div class="p-float-label">
					<p-input-text
						id="recipeUrl"
						v-model="validation.recipeUrl.$model"
						type="text"
						:class="{ 'p-invalid': validation.recipeUrl.$invalid && hasBeenSubmitted }"
						class="w-full" />
					<label for="recipeUrl" :class="{ 'p-error': validation.recipeUrl.$invalid && hasBeenSubmitted }">Recipe url</label>
				</div>
			</div>

			<!-- Image Link Input -->
			<div class="field col-12">
				<div v-if="canEdit" class="p-float-label">
					<p-input-text
						id="imageLink"
						v-model="validation.imageLink.$model"
						type="text"
						:class="{ 'p-invalid': validation.imageLink.$invalid && hasBeenSubmitted }"
						class="w-full" />
					<label for="imageLink" :class="{ 'p-error': validation.imageLink.$invalid && hasBeenSubmitted }">Image url</label>
				</div>
				<div v-else>
					<label for="imageLink" class="text--mini text--darker">Image url</label>
					<Image id="imageLink" :url="recipeDetails.imageLink" :default-url="defaultImageUrl" alt="Recipe image" size="md" class="pt-1"></Image>
				</div>
			</div>

			<!-- Tags selection Input -->
			<div class="field col-12">

				<div v-if="canEdit" class="p-float-label">
					<p-auto-complete
						id="tags"
						v-model="recipeDetails.tags"
						:suggestions="filteredRecipeTags"
						field="title"
						@complete="searchTags($event)"
						multiple
						dropdown
						forceSelection>
						<template #chip="{ value }">
							<div v-tooltip.bottom="{ value: value.description, disabled: value.description.length === 0 }">{{ value.title }}</div>
						</template>
					</p-auto-complete>
					<label for="tags">Tags</label>
				</div>

				<div v-else>
					<label for="recipeTags" class="text--mini text--darker">Tags</label>
					<div id="recipeTags" class="mt-2">
						<p-chip
							v-for="tag in recipeDetails.tags"
							:label="tag.title"
							v-bind:key="tag.id"
							class="mr-1 mb-1">
						</p-chip>
					</div>
				</div>

			</div>
		</article>

		<template v-if="canEdit" #footer>
			<p-button label="Save" icon="pi pi-check" @click="saveRecipe()" class="p-button-success" />
			<p-button label="Cancel" icon="pi pi-times" @click="isVisible = false" class="p-button-text" />
		</template>
	</p-dialog>
</template>

<script setup lang="ts">
import { withDefaults, defineProps, defineEmits, computed, Ref, ref as ref, onMounted } from 'vue'
import { required } from '@vuelidate/validators'
import useVuelidate from "@vuelidate/core";
import { useToast } from "primevue/usetoast";
import Recipe from "@/models/Recipe";
import RecipeController from "@/controllers/RecipeController";
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import firebaseApp from "@/utilities/firebase/firebase";
import RecipeTag from "@/models/RecipeTag";
import RecipeTagController from "@/controllers/RecipeTagController";
import { AutoCompleteCompleteEvent } from "primevue/autocomplete";
import Image from "@/components/form/Image.vue";


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
const recipeTagController = new RecipeTagController()

const isVisible = computed({
	get() {
		return props.isOpen
	},
	set(value: boolean) {
		emit("change-open-state", value)
	}
})

const canEdit: Ref<boolean> = ref(false)
const recipeDetails: Ref<Recipe> = ref(new Recipe())
const recipeTags: Ref<RecipeTag[]> = ref([])
const filteredRecipeTags: Ref<RecipeTag[]> = ref([])
const defaultImageUrl: Ref<string> = ref("")

/* ------------------- Validation ----------------- */

const rules = {
	title: { required },
	description: {},
	recipeUrl: {},
	imageLink: {},
}
const validation = useVuelidate(rules, recipeDetails)
const hasBeenSubmitted = ref(false)

/* ------------------- Methods ----------------- */

function changeOpenState(isOpen: boolean) {
	isVisible.value = isOpen
}

async function loadRecipeModal() {
	recipeTags.value = await getRecipeTags()
	recipeDetails.value = await getRecipe()
	defaultImageUrl.value = recipeController.getDefaultImageUrl()

	const auth = getAuth(firebaseApp);

	onAuthStateChanged(auth, (user) => {
		// User is signed in
		if (!user) {
			return;
		}

		canEdit.value = user.uid === recipeDetails.value.insertedByUID
	});
}

async function getRecipe(): Promise<Recipe> {

	if (props.recipeId.length === 0) {
		return new Recipe()
	}

	return recipeController.get(props.recipeId)
}

async function getRecipeTags(): Promise<RecipeTag[]> {
	return recipeTagController.getAll()
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
	const userId: string = getAuth(firebaseApp).currentUser?.uid ?? ""
	recipe.insertedByUID = userId

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

function searchTags(event: AutoCompleteCompleteEvent) {
	setTimeout(() => {
		if (!event.query.trim().length) {
			return filteredRecipeTags.value = [...recipeTags.value];
		}

		filteredRecipeTags.value = recipeTags.value.filter((tag) => {
			return tag.title.toLowerCase().startsWith(event.query.toLowerCase());
		});
	}, 100);
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
