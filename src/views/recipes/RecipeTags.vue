<template>
	<div class="grid grid-nogutter col-12 md:col-10 md:col-offset-1 lg:col-8 lg:col-offset-2">
		<section class="grid grid-nogutter col-12 center">
			<h1 class="col-12">Recipe Tags</h1>

			<p class="col-12">
				Add, edit and delete recipe tags to be used to identify recipes.
				<br />
				<span class="text--mini">
					Validations and reverting values can be done with the escape key.
				</span>
			</p>
		</section>

		<!-- Main container -->
		<main class="grid grid-nogutter col-12 container-box">

			<!-- Toolbar -->
			<p-toolbar class="mb-2 col-12 p-1">
				<template #start>
					<p-button @click="addNewRecipeTag()" label="New" icon="pi pi-plus"
						class="p-button-success"></p-button>
				</template>
			</p-toolbar>

			<!-- Table -->
			<p-data-table
				:value="recipeTags"
				data-key="id"
				@cell-edit-complete="onCellEditComplete"
				editMode="cell"
				stripedRows
				removableSort
				:autoLayout="true"
				breakpoint="720px"
				responsiveLayout="stack"
				class="col-12">

				<p-column field="title" header="Title" sortable>
					<template #body="{ data, field }">
						<p-input-text
							v-if="data.id.length === 0"
							name="recipeTagTitleBody"
							v-model="data[field]"
							type="text"
							autofocus
							placeholder="title"
							:class="{ 'p-invalid': validation.title.$invalid && hasBeenSubmitted }"
							class="w-full" />

						<span v-else>{{ data[field] }}</span>
						<small
							v-if="validation.title.$invalid && hasBeenSubmitted && data.id == lastEditedTag.id"
							class="p-error">
							{{ validation.title.required.$message.replace('Value', 'Title') }}
						</small>
					</template>

					<template #editor="{ data, field }">
					<span>
						<p-input-text
							name="recipeTagTitleEditor"
							v-model="data[field]"
							type="text"
							placeholder="title"
							:class="{ 'p-invalid': validation.title.$invalid && hasBeenSubmitted }"
							class="w-full" />
					</span>
					</template>
				</p-column>

				<p-column field="description" header="Description" style="width: 65%">
					<template #body="{ data, field }">
						<p-input-text
							v-if="data.id.length === 0"
							id="recipeTagDescriptionBody"
							v-model="data[field]"
							type="text"
							placeholder="description"
							:class="{ 'p-invalid': validation.description.$invalid && hasBeenSubmitted }"
							class="w-full" />

						<span v-else>{{ data[field] }}</span>
					</template>

					<template #editor="{ data, field }">
						<p-input-text
							id="recipeTagDescriptionEditor"
							v-model="data[field]"
							type="text"
							placeholder="description"
							:class="{ 'p-invalid': validation.description.$invalid && hasBeenSubmitted }"
							class="w-full" />
					</template>
				</p-column>

				<p-column
					:exportable="false"
					style="width: 20%; 
					justify-content: end;"
					body-class="text-center">

					<template #body="slotProps">
						<span v-if="slotProps.data.id.length === 0">
							<p-button @click="saveNewRecipeTag(slotProps)"
								class="p-button-rounded p-button-primary m-1">
								<fa :icon="['fas', 'check']"></fa>
							</p-button>
						</span>

						<span>
							<p-button @click="deleteRecipeTag($event, slotProps)"
								class="p-button-rounded p-button-danger m-1">
								<fa :icon="['fas', 'trash']"></fa>
							</p-button>
						</span>
					</template>
				</p-column>
			</p-data-table>

		</main>

		<p-confirm-popup></p-confirm-popup>
	</div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, Ref, ref } from "vue";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import RecipeTag from "@/models/RecipeTag";
import { required } from '@vuelidate/validators'
import useVuelidate from "@vuelidate/core";
import { DataTableCellEditCompleteEvent } from "primevue/datatable";
import { UnwrapNestedRefs } from "@vue/reactivity";
import { ColumnSlots } from "primevue/column";
import RecipeTagController from "@/controllers/RecipeTagController";


/* ------------------- Properties ----------------- */
const toast = useToast();
const confirm = useConfirm();
const recipeTagController = new RecipeTagController();

let recipeTags: Ref<RecipeTag[]> = ref([])
let lastEditedTag: UnwrapNestedRefs<RecipeTag> = reactive(new RecipeTag())

/* ------------------- Validation ----------------- */

const rules = {
	title: { required },
	description: {},
}
const validation = useVuelidate(rules, lastEditedTag)
//const tagsValidations: any[] = []
const hasBeenSubmitted = ref(false)

/* ------------------- Methods ----------------- */

async function loadData() {
	recipeTags.value = await getRecipeTags()
}

async function getRecipeTags() {
	const virtualNewRecipeTags = recipeTags.value.filter(rt => rt.id.length === 0)
	const databaseRecipeTags = await recipeTagController.getAll()
	return databaseRecipeTags.concat(virtualNewRecipeTags);
}

function addNewRecipeTag() {
	const hasUnsavedNewRecipeTag = recipeTags.value.some(rt => rt.id.length === 0)
	if (hasUnsavedNewRecipeTag) {
		return
	}

	const newRecipe = new RecipeTag({})
	lastEditedTag = newRecipe
	recipeTags.value.push(newRecipe)
}

/**
 * There is a bug when clicking the save button immediately after editing a cell, but without exiting. -> This is called before onCellEditComplete.
 * @param slotProps 
 */
async function saveNewRecipeTag(slotProps: Parameters<ColumnSlots["body"]>[0]) {
	hasBeenSubmitted.value = true

	const recipeTag: RecipeTag = slotProps.data
	const recipeTagValidation = useVuelidate(rules, recipeTag)

	const isValid = await recipeTagValidation.value.$validate()
	if (!isValid) {
		return
	}

	recipeTags.value.splice(slotProps.index, 1)
	await recipeTagController.add(recipeTag)
	loadData()
}

async function onCellEditComplete(event: DataTableCellEditCompleteEvent) {
	hasBeenSubmitted.value = true

	const recipeTag = event.newData;
	const isNew = recipeTag.id.length === 0
	const recipeTagValidation = useVuelidate(rules, recipeTag)
  lastEditedTag = recipeTag
	//tagsValidations.push(recipeTagValidation)

	const isValid = await recipeTagValidation.value.$validate()
	if (!isValid) {
		return
	}

	if (isNew) {
		return recipeTags.value[event.index] = event.newData;
	}

	return updateRecipeTag(recipeTag)
}

async function updateRecipeTag(recipeTag: RecipeTag) {
	await recipeTagController.update(recipeTag)
	loadData()
}

function deleteRecipeTag(event: Event, slotProps: Parameters<ColumnSlots["body"]>[0]) {
	const recipeTag: RecipeTag = slotProps.data
	const isNew = recipeTag.id.length === 0

	if (isNew) {
		return recipeTags.value.splice(slotProps.index, 1)
	}

	confirm.require({
		target: event.currentTarget as HTMLElement,
		message: `Are you sure you want to delete "${recipeTag.title}"?`,
		icon: 'pi pi-exclamation-triangle',
		acceptClass: 'p-button-danger',
		accept: async () => {
			await recipeTagController.delete(recipeTag.id)
			loadData()
			return toast.add({ severity: 'success', summary: "Success", detail: `Successfully deleted "${recipeTag.title}"`, life: 3000 });
		},
		reject: () => {
			return toast.add({ severity: 'error', summary: "Error", detail: `Error deleting "${recipeTag.title}"`, life: 3000 });
		}
	});
}

/* ------------------- Lifecycle ----------------- */
onMounted(async () => {
	await loadData()
});

</script>

<style scoped lang="scss">
</style>
