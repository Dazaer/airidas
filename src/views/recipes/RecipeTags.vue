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
					<p-button @click="openDetailsModal()" label="New" class="p-button-success">
						<fa :icon="['fas', 'plus']" size="1x"></fa>
						<span class="ml-2">New</span>
					</p-button>
				</template>

				<template #end v-if="isMobile()">
					<div class="p-2">Sort by: </div>
					<p-button @click="sortByTitle()" label="Title" class="p-button-secondary" :class="isSortAscending || isSortDescending ? '' : 'p-button-outlined'">
						<fa v-if="isSortAscending" :icon="['fas', 'sort-alpha-down-alt']" size="1x"></fa>
						<fa v-else :icon="['fas', 'sort-alpha-up']" size="1x"></fa>
						<span class="ml-2">Title</span>
					</p-button>
				</template>
			</p-toolbar>

			<!-- Table -->
			<p-data-table
				:value="recipeTags"
				data-key="id"
				removableSort
				stripedRows
				sortMode="single"
				:sortField="sortField"
				:sortOrder="sortOrder"
				responsiveLayout="stack"
				:breakpoint="`${VisualBreakpoints.Mobile}px`"
				class="col-12">

				<p-column field="title" header="Title" sortable style="width:20%">
					<template #body="slotProps">
						<div class="pl-2 text-center md:pl-0 md:text-left w-full">{{ slotProps.data.title }}</div>
					</template>
				</p-column>

				<p-column field="description" header="Description" style="width: 65%">
					<template #body="slotProps">
						<div class="pl-2 text-center md:pl-0 md:text-left w-full">{{slotProps.data.description}}</div>
					</template>
				</p-column>

				<p-column
					:exportable="false"
					style="width: 15%; justify-content: end;"
					body-class="text-center">

					<template #body="slotProps">
						<p-button class="col-2 md:col-12 lg:col-5 p-button-rounded p-button-primary justify-content-center mr-1"
							@click="openDetailsModal(slotProps.data.id)">
							<fa :icon="['fas', 'pencil-alt']" size="1x"></fa>
						</p-button>

						<p-button :disabled="slotProps.data.isConfirmed" @click="deleteRecipeTag($event, slotProps.data)"
							class="col-2 md:col-12 lg:col-5 p-button-rounded p-button-danger justify-content-center">
							<fa :icon="['fas', 'trash']" size="1x"></fa>
						</p-button>
					</template>
				</p-column>
				
			</p-data-table>

		</main>

		<RecipeTagDetailsModal
			:is-open="isDetailsOpen"
			:recipe-tag-id="editRecipeTagId"
			@change-open-state="changeDetailsModalState"
			@saved="loadData">
		</RecipeTagDetailsModal>
		<p-confirm-popup></p-confirm-popup>
	</div>
</template>

<script lang="ts" setup>
import { computed, onMounted, Ref, ref } from "vue"
import { useConfirm } from "primevue/useconfirm"
import { useToast } from "primevue/usetoast"
import { VisualBreakpoints, isMobile } from "@/constants/global"
import RecipeTag from "@/models/recipe/RecipeTag"
import RecipeTagDetailsModal from "@/views/recipes/RecipeTagDetailsModal.vue"
import RecipeTagController from "@/controllers/recipes/RecipeTagController"


/* ------------------- Properties ----------------- */
const toast = useToast()
const confirm = useConfirm()
const recipeTagController = new RecipeTagController()

let recipeTags: Ref<RecipeTag[]> = ref([])

const sortField: Ref<string> = ref("")
const sortOrder: Ref<number> = ref(0)
const isSortAscending = computed({
	get() { return sortOrder.value === -1 },
	set(isSettingAscending: boolean) { 
		sortOrder.value = isSettingAscending ? -1 : 0
	}
})
const isSortDescending = computed({
	get() { return sortOrder.value === 1 },
	set(isSettingDescending: boolean) { 
		sortOrder.value = isSettingDescending ? 1 : 0
	}
})

const isDetailsOpen = ref(false)
const editRecipeTagId: Ref<string> = ref("")

/* ------------------- Methods ----------------- */

async function loadData() {
	recipeTags.value = await getRecipeTags()
}

async function getRecipeTags() {
	return recipeTagController.getAll()
}

async function openDetailsModal(recipeTagId: string = "") {
	editRecipeTagId.value = recipeTagId
	changeDetailsModalState(true)
}

function changeDetailsModalState(isOpening: boolean) {
	isDetailsOpen.value = isOpening
}

function sortByTitle() {
	sortField.value = 'title'

	if (isSortDescending.value) {
		return isSortAscending.value = true
	}
	
	if (isSortAscending.value) {
		return isSortAscending.value = false
	}

	isSortDescending.value = true
}

function deleteRecipeTag(event: Event, recipeTag: RecipeTag) {
	confirm.require({
		target: event.currentTarget as HTMLElement,
		message: `Are you sure you want to delete "${recipeTag.title}"?`,
		icon: "fas fa-exclamation-triangle",
		acceptClass: "p-button-danger",
		accept: async () => {
			await recipeTagController.delete(recipeTag.id)
			loadData()
			return toast.add({ severity: "success", summary: "Success", detail: `Successfully deleted "${recipeTag.title}"`, life: 3000 })
		},
		reject: () => {
			return
		}
	})
}

/* ------------------- Lifecycle ----------------- */
onMounted(async () => {
	await loadData()
})

</script>

<style scoped lang="scss">
</style>
