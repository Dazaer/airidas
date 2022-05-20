<template>
	<div class="grid grid-nogutter col-12 md:col-10 md:col-offset-1 lg:col-8 lg:col-offset-2">
		<section class="grid grid-nogutter col-12 center">
			<h1 class="col-12">Recipes</h1>

			<p class="col-12">View and add recipes!</p>
		</section>

		<!-- Enable to update a field value. Will eventually move to a separate page.
			<p-button @click="updateField()" class="p-button-rounded p-button-warning m-1">
			<fa :icon="['fas', 'check']"></fa>
		</p-button> 
		-->

		<main class="grid grid-nogutter col-12 container-box">
			<p-data-view
				class="data-view"
				:value="recipes"
				layout="grid"
				:rows="amountOfRecipesPerPage"
				:sortOrder="sortOrder"
				:sortField="sortField">
				<template #header>
					<p-toolbar class="mb-2 col-12 p-1">
						<template #start>
							<p-button @click="openDetailsModal()" label="New" class="p-button-success">
								<fa :icon="['fas', 'plus']" size="1x"></fa>
								<span class="ml-2">New</span>
							</p-button>
						</template>

						<template #end>
							<div class="my-1">
								<p-dropdown
									v-model="recipesFilter.tag"
									:options="recipeTags"
									optionLabel="title"
									:filter="true"
									placeholder="Select a tag"
									:showClear="true"
									class="mr-1">
								</p-dropdown>
								<p-button @click="loadData()" class="p-button-primary">
									<fa :icon="['fas', 'search']"></fa>
									<span class="ml-1">Search</span>
								</p-button>
							</div>
						</template>

					</p-toolbar>
				</template>

				<template #grid="slotProps">
					<div class="col-12 md:col-4">
						<div class="recipe-item">

							<div class="recipe-item__top-container center">
								<h4 class="recipe-item__title">{{ slotProps.data.title }}</h4>
							</div>

							<div class="recipe-item__content">
								<Image id="imageLink" :url="slotProps.data.imageLink" :default-url="defaultImageUrl" alt="Recipe image"></Image>

								<div class="flex">
									<p class="recipe-item__description">{{ slotProps.data.description }}</p>
								</div>

								<div class="recipe-item__tags-container flex-none">
									<p-chip class="flex-none mr-1 mb-1" v-bind:key="tag.id"
										v-for="tag in slotProps.data.tags" :label="tag.title">
									</p-chip>
								</div>
							</div>

							<div class="flex flex-1">
								<p class="align-self-end flex flex-auto text--mini text--darker">by: {{ slotProps.data.insertedByEmail }}</p>

								<div class="recipe-item__bottom-container">
									<span
										v-tooltip.top="{ value: 'Open the recipe\'s page in a new tab', disabled: false }">
										<p-button
											@click="openRecipeUrl(slotProps.data.recipeUrl)"
											:disabled="slotProps.data.recipeUrl.length === 0"
											class="p-button-rounded p-button-primary m-1">
											<fa-layers fixed-width>
												<fa :icon="['fas', 'book-reader']" transform="grow-10"></fa>
												<fa
													:icon="['fas', 'utensils']"
													transform="shrink-8 down-4 right-7"
													class="text-primary">
												</fa>
											</fa-layers>
										</p-button>
									</span>

									<span class="flex">
										<div v-tooltip.top="{ value: 'View recipe details' }">
											<p-button @click="openDetailsModal(slotProps.data.id)"
												:class="currentUserId === slotProps.data.insertedByUID ? 'p-button-warning' : 'p-button-primary'"
												class="p-button-rounded m-1">
												<fa :icon="['fas', 'eye']"></fa>
											</p-button>
										</div>
									</span>
								</div>

							</div>

						</div>
					</div>
				</template>

				<template #empty>
					<div class="col-12">
						<p v-if="hasRecipesForFilter" class="center">No more recipes found.</p>
						<p v-else class="center">No recipes found for this filter. Be the first to add one!</p>
					</div>
				</template>

				<template #footer>
					<Paginator
						v-if="amountOfRecipesPerPage > 0"
						@interface="getPaginatorMethods"
						@next="goToNextPage"
						@previous="goToPreviousPage"
						:data="recipes"
						:total-amount="totalRecipesAmount"
						:fallback-doc-id="previousPageLastRecipeId"
						:show-count="!hasFilter">
					</Paginator>
				</template>
			</p-data-view>

		</main>

		<RecipeDetailsModal
			:is-open="isDetailsOpen"
			:recipe-id="editRecipeId"
			@change-open-state="changeDetailsModalState"
			@list-changed="loadData">
		</RecipeDetailsModal>
		<p-confirm-popup></p-confirm-popup>
	</div>
</template>

<script lang="ts" setup>
import { computed, ComputedRef, onMounted, reactive, Ref, ref } from "vue"
import Recipe from "@/models/recipe/Recipe"
import RecipeController from "@/controllers/recipes/RecipeController"
import RecipeDetailsModal from "@/components/modals/RecipeDetailsModal.vue"
import RecipeTag from "@/models/recipe/RecipeTag"
import { RecipesFilter } from "@/models/recipe/virtual/RecipesFilter"
import RecipeTagController from "@/controllers/recipes/RecipeTagController"
import firebaseApp from "@/utilities/firebase/firebase"
import { getAuth, onAuthStateChanged } from "@firebase/auth"
import Image from "@/components/form/Image.vue"
import Paginator, { PaginatorMethods } from "@/components/form/Paginator.vue"

/* ------------------- Properties ----------------- */
const recipeController = new RecipeController()
const recipeTagController = new RecipeTagController()
let paginatorMethods: PaginatorMethods

const recipes: Ref<Recipe[]> = ref([])
const recipeTags: Ref<RecipeTag[]> = ref([])
const defaultImageUrl: Ref<string> = ref("")
const totalRecipesAmount: Ref<number> = ref(0)
const amountOfRecipesPerPage: Ref<number> = ref(0)
const previousPageLastRecipeId: Ref<string> = ref("")
const isDetailsOpen: Ref<boolean> = ref(false)
const editRecipeId: Ref<string> = ref("")
const currentUserId: Ref<string> = ref("")


/* --test sample recipes for adjusting layout
const recipes: Ref<Recipe[]> = ref([
	new Recipe({ title: "IMAGE overflows.", tags: [new RecipeTag({ title: "Test1" }), new RecipeTag({ title: "Test2 longer tag" }), new RecipeTag({ title: "Test2" })], description: "Description of recipe right here", imageLink: "https://lepetiteats.com/wp-content/uploads/2016/03/Pra-Ram-Tofu-2.jpg" }),
	new Recipe({ title: "TITLE overflows super long title here not sure what will happen to this here's some more lines just to fill it up", tags: [new RecipeTag({ title: "Test1" }), new RecipeTag({ title: "Test2 longer tag" }), new RecipeTag({ title: "Test2" })], description: "THIS is another recipe that i just got from somewhrer and omg it's awesome look at it right now", imageLink: "https://mishkanet.com/img/251847.jpg" }),
	new Recipe({ title: "ALL overflows everywhere  - super long title here not sure what asdfsdf sd fsd f sdf sd fds f ssssss will happen to this here's some more lines just to fill it up no but really this should be so long that it overflows completely", tags: [new RecipeTag({ title: "Test1" }), new RecipeTag({ title: "Test2 longer tag" }), new RecipeTag({ title: "Test2" }), new RecipeTag({ title: "Test3" }), new RecipeTag({ title: "Test4" }), new RecipeTag({ title: "Test5" })], description: "Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right  Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right herehere Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here", imageLink: "https://lepetiteats.com/wp-content/uploads/2016/03/Pra-Ram-Tofu-2.jpg" }),
	new Recipe({ title: "IMAGE none", description: "Description of recipe right here", imageLink: "" }),
	new Recipe({ title: "DESCRIPTION overflows.", description: "THIS is another recipe that i just got from somewhrer and omg it's awesome look at it right now THIS is another recipe that i just got from somewhrer and omg it's awesome look at it right now THIS is another recipe that i just got from somewhrer and omg it's awesome look at it right now THIS is another recipe that i just got from somewhrer and omg it's awesome look at it right now THIS is another recipe that i just got from somewhrer and omg it's awesome look at it right now THIS is another recipe that i just got from somewhrer and omg it's awesome look at it right now THIS is another recipe that i just got from somewhrer and omg it's awesome look at it right now THIS is another recipe that i just got from somewhrer and omg it's awesome look at it right now THIS is another recipe that i just got from somewhrer and omg it's awesome look at it right now THIS is another recipe that i just got from somewhrer and omg it's awesome look at it right now THIS is another recipe that i just got from somewhrer and omg it's awesome look at it right now THIS is another recipe that i just got from somewhrer and omg it's awesome look at it right now THIS is another recipe that i just got from somewhrer and omg it's awesome look at it right now THIS is another recipe that i just got from somewhrer and omg it's awesome look at it right now THIS is another recipe that i just got from somewhrer and omg it's awesome look at it right now THIS is another recipe that i just got from somewhrer and omg it's awesome look at it right now THIS is another recipe that i just got from somewhrer and omg it's awesome look at it right now THIS is another recipe that i just got from somewhrer and omg it's awesome look at it right now THIS is another recipe that i just got from somewhrer and omg it's awesome look at it right now THIS is another recipe that i just got from somewhrer and omg it's awesome look at it right now THIS is another recipe that i just got from somewhrer and omg it's awesome look at it right now", imageLink: "https://mishkanet.com/img/251847.jpg" }),
	new Recipe({ title: "An even more vertically long image", description: "Description of recipe right here", imageLink: "https://images.wine.co.za/GetWineImage.ashx?ImageSize=large&IMAGEID=268293" }),
	new Recipe({ title: "Recipe 2", description: "THIS is another recipe that i just got from somewhrer and omg it's awesome look at it right now", imageLink: "https://mishkanet.com/img/251847.jpg" }),
	new Recipe({ title: "Recipe 1", description: "Description of recipe right here", imageLink: "https://lepetiteats.com/wp-content/uploads/2016/03/Pra-Ram-Tofu-2.jpg" }),
])
	*/


/* ------------------- Querying & Filtering ----------------- */

const sortOrder = ref()
const sortField = ref()
const recipesFilter: RecipesFilter = reactive(new RecipesFilter())
const hasFilter: ComputedRef<boolean> = computed(() => recipesFilter?.tag?.id?.length > 0)
const hasRecipesForFilter: ComputedRef<boolean> = computed(() => previousPageLastRecipeId?.value.length > 0)

/* ------------------- Methods ----------------- */
async function loadData() {
	recipes.value = await getRecipes()
	recipeTags.value = await getRecipeTags()
	totalRecipesAmount.value = await recipeController.getTotalRecipesCount()
	defaultImageUrl.value = recipeController.getDefaultImageUrl()
	amountOfRecipesPerPage.value = recipeController.getRecipesPerPageCount()

	previousPageLastRecipeId.value = recipes.value[recipes.value.length - 1]?.id ?? previousPageLastRecipeId.value
	paginatorMethods?.reset()
}

async function getRecipes(recipeController?: RecipeController): Promise<Recipe[]> {
	let controller = recipeController ?? new RecipeController()

	if (hasFilter.value) {
		controller = controller.filterBy("tags", [recipesFilter.tag])
	}
	window.scrollTo(0, 0)
	return controller.limitTo().orderBy("updatedOnTimestamp", "desc").getAll()
}

async function getRecipeTags(): Promise<RecipeTag[]> {
	return recipeTagController.getAll()
}

function openRecipeUrl(recipeUrl: string = "") {
	window.open(recipeUrl, "_blank")
}

function openDetailsModal(recipeId: string = "") {
	editRecipeId.value = recipeId
	changeDetailsModalState(true)
}

function changeDetailsModalState(isOpening: boolean) {
	isDetailsOpen.value = isOpening
}

/* Paginator ----------------- */
function getPaginatorMethods(methods: PaginatorMethods) {
	paginatorMethods = methods
}

async function goToNextPage(startAfterDocId: string) {
	const recipeController = new RecipeController().startAfter(startAfterDocId)
	const nextPageRecipes = await getNextPageRecipes(recipeController)
	const currentPageLastRecipeId = getCurrentPageLastRecipeId(nextPageRecipes)

	recipes.value = nextPageRecipes
	previousPageLastRecipeId.value = currentPageLastRecipeId
}

/**
 * When there's only a single page of content and we press NextPage, we get an empty page.
 * When we press PreviousPage from that empty page there's no previous recipe to fallback to, so we do a fresh reload.
 * @param nextPageRecipeController 
 */
async function getNextPageRecipes(nextPageRecipeController: RecipeController): Promise<Recipe[]> {
	const nextPageRecipes = await getRecipes(nextPageRecipeController)
	const hasCurrentPageRecipes = recipes.value.length > 0
	const hasNextPageRecipes = nextPageRecipes.length > 0

	const shouldDoFreshLoad = !hasNextPageRecipes && !hasCurrentPageRecipes
	if (shouldDoFreshLoad) {
		return recipes.value = await getRecipes()
	}

	return nextPageRecipes
}

/**
 * Will only get a new recipeId if the current page is not the last, otherwise it will remain the same.
 * @param nextPageRecipes 
 */
function getCurrentPageLastRecipeId(nextPageRecipes: Recipe[]): string {
	const hasRecipesInCurrentPage = recipes.value.length > 0
	const isLastPage = nextPageRecipes.length === 0
	let currentPageLastRecipeId = previousPageLastRecipeId.value

	if (hasRecipesInCurrentPage && !isLastPage) {
		currentPageLastRecipeId = recipes.value[recipes.value.length - 1]?.id
	}

	return currentPageLastRecipeId
}

async function goToPreviousPage(lastDocId: string) {
	let previousPageRecipeController = new RecipeController().endBefore(lastDocId)
	recipes.value = await getRecipes(previousPageRecipeController)
}
/* Paginator END----------------- */


/*
function updateField() {
	recipeController.updateField("insertedOnTimestamp", Timestamp.now())
}
/*

/* ------------------- Lifecycle ----------------- */
onMounted(async () => {
	const auth = getAuth(firebaseApp)

	onAuthStateChanged(auth, (user) => {
		// User is signed in
		if (!user) {
			return
		}

		currentUserId.value = user.uid
	})

	await loadData()
})

</script>

<style scoped lang="scss">
.data-view {
	width: 100%;
}

.recipe-item {
	@include container-item-box;
	border: 1px solid var(--surface-border);
	height: 80vh;
	margin: 0.5rem;

	display: flex;
	flex-direction: column;

	.recipe-item__top-container {
		display: flex;
		flex: 0.1 1 auto;
	}

	.recipe-item__title {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.recipe-item__content {
		display: flex;
		flex-direction: column;
		flex: 10 1 auto;
		min-height: 0;
	}

	.recipe-item__description {
		display: -webkit-box;
		-webkit-line-clamp: 10;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.recipe-item__tags-container {
		display: flex;
		overflow-x: auto;
		scrollbar-width: thin;
	}

	.recipe-item__bottom-container {
		display: flex;
		align-items: flex-end;
		align-self: flex-end;
		//flex: 1 1 auto;
	}

}
</style>
