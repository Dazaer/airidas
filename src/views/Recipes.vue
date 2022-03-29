<template>
	<div class="grid grid-nogutter col-12 md:col-10 md:col-offset-1 lg:col-8 lg:col-offset-2">
		<section class="grid grid-nogutter col-12 center">
			<h1 class="col-12">Recipes</h1>

			<p class="col-12">View and add recipes!</p>
		</section>

		<main class="grid grid-nogutter col-12 container-box">
			<p-data-view :value="recipes" :layout="layout" :paginator="true" :rows="9" :sortOrder="sortOrder" :sortField="sortField">
				<template #header>
					<p-toolbar class="mb-2 col-12 p-1">
						<template #start>
							<p-button label="New" icon="pi pi-plus" class="p-button-success"></p-button>
						</template>

						<!-- <div class="col-6" style="text-align: left">
						<Dropdown v-model="sortKey" :options="sortOptions" optionLabel="label" placeholder="Sort By Price" @change="onSortChange($event)" />
						</div>-->
					</p-toolbar>
				</template>

				<template #grid="slotProps">
					<div class="col-12 md:col-4">
						<div class="recipe-item flex flex-column">
							<div class="recipe-item-top center">
								<h4 class="recipe-item-top__title">{{ slotProps.data.title }}</h4>
							</div>

							<!-- <div class="col-12">
								<img class="main-image center" :src="slotProps.data.imageLink" :alt="slotProps.data.title" />
								<p class="center">{{ slotProps.data.description }}</p>
							</div>-->

							<div class="recipe-item-content flex flex-column">
								<img class="main-image" :src="slotProps.data.imageLink" :alt="slotProps.data.title" />
								<p class="my-0 center">{{ slotProps.data.description }}</p>
							</div>

							<div class="recipe-item-bottom center-right">
								<p-button icon="pi pi-pencil" class="p-button-rounded p-button-primary m-1" @click="alert('edit')" />
								<p-button icon="pi pi-trash" class="p-button-rounded p-button-danger m-1" @click="alert('deleted')" />
							</div>
						</div>
					</div>
				</template>
			</p-data-view>
		</main>
	</div>
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref } from "vue";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import Recipe from "@/models/Recipe";

/* ------------------- Properties ----------------- */
const toast = useToast();
const confirm = useConfirm();

const recipes: Recipe[] = [
	new Recipe({ title: "Recipe 1", description: "Description of recipe right here", imageLink: "https://lepetiteats.com/wp-content/uploads/2016/03/Pra-Ram-Tofu-2.jpg" }),
	new Recipe({ title: "Recipe 2 super long title here not sure what will happen to this here's some more lines just to fill it up", description: "THIS is another recipe that i just got from somewhrer and omg it's awesome look at it right now", imageLink: "https://mishkanet.com/img/251847.jpg" }),
	new Recipe({ title: "Recipe 1", description: "Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here", imageLink: "https://lepetiteats.com/wp-content/uploads/2016/03/Pra-Ram-Tofu-2.jpg" }),
	new Recipe({ title: "Recipe 1", description: "Description of recipe right here", imageLink: "https://lepetiteats.com/wp-content/uploads/2016/03/Pra-Ram-Tofu-2.jpg" }),
	new Recipe({ title: "Recipe 2", description: "THIS is another recipe that i just got from somewhrer and omg it's awesome look at it right now", imageLink: "https://mishkanet.com/img/251847.jpg" }),
	new Recipe({ title: "Recipe 1", description: "Description of recipe right here", imageLink: "https://lepetiteats.com/wp-content/uploads/2016/03/Pra-Ram-Tofu-2.jpg" }),
	new Recipe({ title: "Recipe 2", description: "THIS is another recipe that i just got from somewhrer and omg it's awesome look at it right now", imageLink: "https://mishkanet.com/img/251847.jpg" }),
	new Recipe({ title: "Recipe 1", description: "Description of recipe right here", imageLink: "https://lepetiteats.com/wp-content/uploads/2016/03/Pra-Ram-Tofu-2.jpg" }),
]
const layout = ref('grid');
const sortOrder = ref();
const sortField = ref();
/* ------------------- Methods ----------------- */



/* ------------------- Lifecycle ----------------- */


</script>

<style scoped lang="scss">
.recipe-item {
	@include container-item-box;

	//max-height: 100%;
	height: 80vh;
	margin: 0.5rem;
	border: 1px solid var(--surface-border);
	//max-width: 40vw;

	//when media under certain width, make height: auto? inherit? 100%?
}

.recipe-item-top {
	//height: 100%;
	//width: 100%;
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
	overflow: hidden;

	.recipe-item-top__title {
		overflow: hidden;
	}
}

.recipe-item-content {
	flex-grow: 1;
	max-height: 100%;
	max-width: 100%;
}

.recipe-item-bottom {
	//height: 100%;
	max-height: 100%;
	width: 100%;
}

.main-image {
	height: 20vh;
	max-height: 100%;
	max-width: 100%;
	//width: 100%;
	//margin: auto;
}
</style>
