<template>
	<p-dialog
		header="Recipe Details"
		:visible="isOpen"
		@show="onRecipeModalOpen"
		@hide="onRecipeModalClosed"
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
				<div v-if="isEditing">
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

			<!-- Image Link Input -->
			<div class="field col-12">
				<div v-if="isEditing" class="p-float-label">
					<p-input-text
						id="imageLink"
						v-model="validation.imageLink.$model"
						type="text"
						:class="{ 'p-invalid': validation.imageLink.$invalid && hasBeenSubmitted }"
						class="w-full" />
					<label for="imageLink" :class="{ 'p-error': validation.imageLink.$invalid && hasBeenSubmitted }">Image url</label>
				</div>
				<div v-else>
					<label for="imageLink" class="text--mini text--darker">Image</label>
					<Image id="imageLink" :url="recipeDetails.imageLink" :default-url="defaultImageUrl" alt="Recipe image" size="md" class="pt-1"></Image>
				</div>
			</div>

			<!-- Description Input -->
			<div class="field col-12">
				<div v-if="isEditing" class="p-float-label">
					<span for="recipeDescription" class="text--mini text--darker pl-2">
						Description
					</span>

					<quill-editor
						id="recipeDescription"
						:prop-model="recipeDetails.description"
						placeholder-text="Description"
						@changed="updateDescription"
						class="pt-1">
					</quill-editor>
				</div>

				<div v-else>
					<quill-editor :prop-model="recipeDetails.description" :readonly="true" placeholder-text="Description"></quill-editor>
				</div>
			</div>

			<!-- Recipe Url Input -->
			<div v-if="isEditing" class="field col-12">
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

			<!-- Tags selection Input -->
			<div class="field col-12">

				<div v-if="isEditing" class="p-float-label">

					<p-auto-complete
						id="tags"
						inputId="autoCompleteInputId"
						v-model="recipeDetails.tags"
						:suggestions="filteredRecipeTags"
						optionLabel="title"
						multiple
						dropdown
						:forceSelection="true"
						@item-select="addNewRecipeTag"
						@complete="searchRecipeTags($event)"
						>
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

			<div v-if="!isEditing">
				<p-button @click="beginEdit()" class="p-button-rounded p-button-primary m-1">
					<fa :icon="['fas', 'pencil-alt']"></fa>
					<span class="ml-1">Edit</span>
				</p-button>

				<p-button @click="deleteRecipe($event, recipeDetails)" class="p-button-rounded p-button-danger m-1">
					<fa :icon="['fas', 'trash']"></fa>
					<span class="ml-1">Delete</span>
				</p-button>
			</div>

			<div v-else>
				<p-button @click="saveRecipe()" class="p-button-success m-1">
					<fa :icon="['fas', 'check']"></fa>
					<span class="ml-1">Save</span>
				</p-button>

				<p-button @click="cancelEdit()" class="p-button-rounded p-button-text m-1">
					<fa :icon="['fas', 'times']"></fa>
					<span class="ml-1">Cancel</span>
				</p-button>
			</div>

		</template>
	</p-dialog>
</template>

<script setup lang="ts">
import { withDefaults, defineProps, defineEmits, computed, Ref, ref as ref, ComputedRef } from "vue"
import { required } from "@vuelidate/validators"
import useVuelidate from "@vuelidate/core"
import { useToast } from "primevue/usetoast"
import Recipe from "@/models/recipe/Recipe"
import RecipeController from "@/controllers/recipes/RecipeController"
import { getAuth, onAuthStateChanged } from "@firebase/auth"
import firebaseApp from "@/utilities/firebase/firebase"
import RecipeTag from "@/models/recipe/RecipeTag"
import RecipeTagController from "@/controllers/recipes/RecipeTagController"
import { AutoCompleteCompleteEvent, AutoCompleteItemSelectEvent } from "primevue/autocomplete"
import Image from "@/components/form/Image.vue"
import QuillEditor from "@/components/form/QuillEditor.vue"
import { useConfirm } from "primevue/useconfirm"


/* ------------------- Props ----------------- */

interface propsInterface {
	isOpen?: boolean
	recipeId: string
}
const props = withDefaults(defineProps<propsInterface>(), {
	isOpen: false,
})

const emit = defineEmits<{
	(event: "change-open-state", isOpen: boolean): void,
	(event: "list-changed", recipe: Recipe): string,
}>()

/* ------------------- Properties ----------------- */

const toast = useToast()
const confirm = useConfirm()
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
const isNew: ComputedRef<boolean> = computed(() => recipeDetails.value.id.length === 0)
const canEdit: ComputedRef<boolean> = computed(() => isNew.value || currentUserId.value === recipeDetails.value.insertedByUID)
		
const currentUserId: Ref<string> = ref("")
const isEditing: Ref<boolean> = ref(false)
const recipeDetailsOriginal: Ref<Recipe> = ref(new Recipe())
const recipeDetails: Ref<Recipe> = ref(new Recipe())
const recipeTags: Ref<RecipeTag[]> = ref([])
const filteredRecipeTags: Ref<RecipeTag[]> = ref([])
const defaultImageUrl: Ref<string> = ref("")

/* ------------------- Validation ----------------- */

const rules = {
	title: { required },
	//description: {},
	recipeUrl: {},
	imageLink: {},
}
const validation = useVuelidate(rules, recipeDetails)
const hasBeenSubmitted = ref(false)

/* ------------------- Methods ----------------- */

function changeOpenState(isOpen: boolean) {
	isVisible.value = isOpen
}

async function onRecipeModalOpen() {
	await loadRecipeModal()

	if (isNew.value) {
		beginEdit()
	}
}

function onRecipeModalClosed() {
	resetModalState()
}

async function loadRecipeModal() {
	recipeTags.value = await getRecipeTags()
	recipeDetails.value = await getRecipe()
	recipeDetailsOriginal.value = recipeDetails.value
	defaultImageUrl.value = recipeController.getDefaultImageUrl()

	const auth = getAuth(firebaseApp)

	onAuthStateChanged(auth, (user) => {
		// User is signed in
		if (!user) {
			return
		}

		currentUserId.value = user.uid
	})
}

function beginEdit() {
	isEditing.value = true
}

function updateDescription(newDescription:string) {
	recipeDetails.value.description = newDescription;
}

function cancelEdit() {
	resetModalState()

	if (isNew.value) {
		changeOpenState(false)
	}
}

function resetModalState() {
	recipeDetails.value = { ...recipeDetailsOriginal.value }
	isEditing.value = false
	hasBeenSubmitted.value = false
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
		emit("list-changed", recipeDetails.value)
		changeOpenState(false)
		return resetModalState()
	}
}

async function addRecipe(recipe: Recipe) {
	const currentUser = getAuth(firebaseApp).currentUser
	recipe.insertedByUID = currentUser?.uid ?? ""
	recipe.insertedByEmail = currentUser?.email ?? ""

	return recipeController.add(recipe)
		.then(() => {
			toast.add({ severity: "success", summary: "Success", detail: "Successfully added recipe", life: 5000 })
			return true
		})
		.catch(error => {
			console.error(`code: ${error.code}\n message: ${error.message}\n stack: ${error.stack}\n`)
			toast.add({ severity: "error", summary: "Error adding recipe", detail: `${error}` })
			return false
		})
}

async function updateRecipe(recipe: Recipe) {
	return recipeController.update(recipe)
		.then(() => {
			toast.add({ severity: "success", summary: "Success", detail: "Successfully updated recipe", life: 5000 })
			return true
		})
		.catch(error => {
			console.error(`code: ${error.code}\n message: ${error.message}\n stack: ${error.stack}\n`)
			toast.add({ severity: "error", summary: "Error updating recipe", detail: `${error}` })
			return false
		})
}

function deleteRecipe(event: Event, recipe: Recipe) {
	confirm.require({
		target: event.currentTarget as HTMLElement,
		message: `Are you sure you want to delete "${recipe.title}"?`,
		icon: "fas fa-exclamation-triangle",
		acceptClass: "p-button-danger",
		accept: async () => {
			await recipeController.delete(recipe.id)
			toast.add({ severity: "success", summary: "Success", detail: `Successfully deleted "${recipe.title}"`, life: 3000 })

			emit("list-changed", recipeDetails.value)
			changeOpenState(false)
			return resetModalState()
		},
		reject: () => {
			return
		}
	})
}

async function addNewRecipeTag(event: AutoCompleteItemSelectEvent): Promise<void> {

	let recipeTag = event?.value as RecipeTag
	const isNewRecipeTag = recipeTag?.id?.length === 0
	if (!isNewRecipeTag) {
		return
	}

	const startIndex = recipeTag.title.indexOf('"') + 1
	const endIndex = recipeTag.title.lastIndexOf('"')
	const newRecipeTagTitle = recipeTag.title.substring(startIndex, endIndex)
	recipeTag.title = newRecipeTagTitle

	const isValidTag = recipeTag.title?.length > 2;
	if (!isValidTag) {
		setTimeout(() => {
			recipeDetails.value.tags = recipeDetails.value.tags.filter(tag => tag.title !== newRecipeTagTitle)
		}, 0);
		return toast.add({ severity: "error", summary: "Error adding recipe tag", detail: `The tag must have more than 2 characters and they must be valid`, life: 3000 })
	}

	try {
		filteredRecipeTags.value = [...recipeTags.value]

		await recipeTagController.add(recipeTag)
		recipeTags.value = await getRecipeTags()

		const newSavedTag = recipeTags.value.find(tag => tag.title.toLowerCase() === newRecipeTagTitle.toLowerCase())
		if (newSavedTag == null) {
			throw new Error("The tag does not exist in the database")
		}

		toast.add({ severity: "success", summary: "Success", detail: `Successfully created new tag: "${newRecipeTagTitle}"`, life: 3000 })
	} catch (error) {
		toast.add({ severity: "error", summary: "Error adding recipe tag", detail: `${error}` })
	}

}

function searchRecipeTags(event: AutoCompleteCompleteEvent) {
	setTimeout(() => {
		const searchInput = event?.query?.trim().toLowerCase()
		if (searchInput?.length === 0) {
			filteredRecipeTags.value = [...recipeTags.value]
			return
		}

		const hasRecipeTagTemplate = filteredRecipeTags.value.some(tag => tag?.id?.length === 0)
		if (hasRecipeTagTemplate) {
			filteredRecipeTags.value.pop()
		}

		filteredRecipeTags.value = recipeTags.value.filter((tag) => {
			const hasSearchInput = tag.title.toLowerCase().includes(searchInput)
			const isAlreadyAdded = recipeDetails.value.tags.some(existingTag => existingTag.title === tag.title)

			return hasSearchInput && !isAlreadyAdded
		})

		const isSearchInputExactMatch = filteredRecipeTags.value.some(filteredTag => filteredTag.title.toLowerCase() === searchInput)
		if (isSearchInputExactMatch) {
			return
		}
		const newRecipeTagTemplate = new RecipeTag({title:` + Add new recipe tag: "${searchInput}"`})
		filteredRecipeTags.value.push(newRecipeTagTemplate)
	}, 100)
}

/* ------------------- Lifecycle ----------------- */
/* https://lifesaver.codes/answer/unmount-modal-on-close
// Check this if decide to move from changing state to mounted/unmounted
onMounted(async () => {

});

onUnmounted(() => {
	isEditing.value = false
})
	*/
</script>

<!-- Cannot use scoped here as it won't affect the modal -->
<style lang="scss">
</style>
