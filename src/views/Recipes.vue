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
						<div class="recipe-item">
							<div class="recipe-item-top">
								<h4 class="recipe-item-top__title">{{ slotProps.data.title }}</h4>
							</div>

							<div class="recipe-item-content">
								<div class="recipe-item-content__image-container">
									<img class="recipe-item-content__image" :src="slotProps.data.imageLink" :alt="slotProps.data.title" />
								</div>
								<div class="recipe-item-content__description-container">
									<p class="recipe-item-content__description">{{ slotProps.data.description }}</p>
								</div>
							</div>

							<div class="recipe-item-bottom">
								<p-button icon="pi pi-pencil" class="recipe-item-bottom__button p-button-rounded p-button-primary m-1" @click="alert('edit')" />
								<p-button icon="pi pi-trash" class="recipe-item-bottom__button p-button-rounded p-button-danger m-1" @click="alert('deleted')" />
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
	new Recipe({ title: "IMAGE overflows.", description: "Description of recipe right here", imageLink: "https://lepetiteats.com/wp-content/uploads/2016/03/Pra-Ram-Tofu-2.jpg" }),
	new Recipe({ title: "TITLE overflows super long title here not sure what will happen to this here's some more lines just to fill it up", description: "THIS is another recipe that i just got from somewhrer and omg it's awesome look at it right now", imageLink: "https://mishkanet.com/img/251847.jpg" }),
	new Recipe({ title: "ALL overflows everywhere  - super long title here not sure what asdfsdf sd fsd f sdf sd fds f ssssss will happen to this here's some more lines just to fill it up no but really this should be so long that it overflows completely", description: "Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right  Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right herehere Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here Description of recipe right here", imageLink: "https://lepetiteats.com/wp-content/uploads/2016/03/Pra-Ram-Tofu-2.jpg" }),
	new Recipe({ title: "IMAGE none", description: "Description of recipe right here", imageLink: "" }),
	new Recipe({ title: "DESCRIPTION overflows.", description: "THIS is another recipe that i just got from somewhrer and omg it's awesome look at it right now THIS is another recipe that i just got from somewhrer and omg it's awesome look at it right now THIS is another recipe that i just got from somewhrer and omg it's awesome look at it right now THIS is another recipe that i just got from somewhrer and omg it's awesome look at it right now THIS is another recipe that i just got from somewhrer and omg it's awesome look at it right now THIS is another recipe that i just got from somewhrer and omg it's awesome look at it right now THIS is another recipe that i just got from somewhrer and omg it's awesome look at it right now THIS is another recipe that i just got from somewhrer and omg it's awesome look at it right now THIS is another recipe that i just got from somewhrer and omg it's awesome look at it right now THIS is another recipe that i just got from somewhrer and omg it's awesome look at it right now THIS is another recipe that i just got from somewhrer and omg it's awesome look at it right now THIS is another recipe that i just got from somewhrer and omg it's awesome look at it right now THIS is another recipe that i just got from somewhrer and omg it's awesome look at it right now THIS is another recipe that i just got from somewhrer and omg it's awesome look at it right now THIS is another recipe that i just got from somewhrer and omg it's awesome look at it right now THIS is another recipe that i just got from somewhrer and omg it's awesome look at it right now THIS is another recipe that i just got from somewhrer and omg it's awesome look at it right now THIS is another recipe that i just got from somewhrer and omg it's awesome look at it right now THIS is another recipe that i just got from somewhrer and omg it's awesome look at it right now THIS is another recipe that i just got from somewhrer and omg it's awesome look at it right now THIS is another recipe that i just got from somewhrer and omg it's awesome look at it right now", imageLink: "https://mishkanet.com/img/251847.jpg" }),
	new Recipe({ title: "An even more vertically long image", description: "Description of recipe right here", imageLink: "https://images.wine.co.za/GetWineImage.ashx?ImageSize=large&IMAGEID=268293" }),
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
	border: 1px solid var(--surface-border);
	height: 80vh;
	margin: 0.5rem;

	display: flex;
	flex-direction: column;
}

.recipe-item-top {
	display: flex;
	flex: 0.1 1 auto;

	.recipe-item-top__title {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
}

.recipe-item-content {
	display: flex;
	flex-direction: column;
	flex: 10 1 auto;
	min-height: 0;

	.recipe-item-content__image-container {
		display: flex;
		flex: 1 1 content;
		min-height: 0;
	}
	.recipe-item-content__image {
		max-height: 100%;
		object-fit: contain;
		width: 100%;
	}

	.recipe-item-content__description-container {
		display: flex;
		//flex: 1 1 content;
	}

	.recipe-item-content__description {
		display: -webkit-box;
		-webkit-line-clamp: 10;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
}

.recipe-item-bottom {
	display: flex;
	align-items: flex-end;
	align-self: flex-end;
	flex: 1 1 auto;

	.recipe-item-bottom__button {
	}
}
</style>
