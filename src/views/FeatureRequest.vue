<template>
	<div class="grid grid-nogutter col-12 md:col-10 md:col-offset-1 lg:col-8 lg:col-offset-2">
		<section class="grid grid-nogutter col-12 center">
			<h1 class="col-12">Feature Request</h1>

			<p class="col-12">
				Add, edit and delete features that you wish to be implemented in a future release.
				<br />Upon a feature being confirmed, please contact the developer if you do not wish to have the feature implemented anymore.
			</p>
		</section>

		<!-- Main container for feature development -->
		<main class="grid grid-nogutter col-12 container-box">
			<div class="col-12 center p-1">
				<fa :icon="['fas', 'spinner']" size="2x" spin class="m-1"></fa>
				<p class="font-italic">In development</p>
			</div>

			<p-toolbar class="mb-2 col-12 p-1">
				<template #start>
					<p-button @click="openFeatureModal()" label="New" icon="pi pi-plus" class="p-button-success"></p-button>
				</template>

				<template #end>
					<p-button label="Delete" icon="pi pi-trash" class="p-button-danger"></p-button>
				</template>
			</p-toolbar>

			<p-data-table
				:value="features"
				data-key="id"
				stripedRows
				editMode="row"
				v-model:editingRows="editingRows"
				sortMode="multiple"
				@row-edit-save="saveRowEdit"
				responsiveLayout="stack"
				breakpoint="720px"
				class="col-12"
			>
				<!--
				:rowClass="getRowClass"

				-->
				<p-column field="title" header="Title" style="width: 80%;">
				<template #header>
					<!-- <div class="text-secondary center w-full">
						Title
					</div> -->
				</template>
					<template #editor="{ data, field }">
						<p-input-text v-model="data[field]" autofocus class="w-full ml-2 md:ml-0"/>
					</template>
					<template #body="slotProps">
						<div class="pl-2 text-center md:pl-0 md:text-left w-full">{{slotProps.data.title}}</div>
					</template>
				</p-column>

				<!-- <p-column field="description" header="Description" style="width: 80%">
					<template #editor="{ data, field }">
						<p-textarea v-model="data[field]" :autoResize="true" rows="5" cols="30" autofocus />
					</template>
					<template #body="slotProps">
						<div class="center">{{slotProps.data.description}}</div>
					</template>
				</p-column> -->

				<p-column field="priority" header="Priority" sortable style="width: 10%">
					<template #editor="{ data, field }" class="w-full">
						<p-dropdown
							v-model="data[field]"
							:options="statuses"
							optionLabel="label"
							optionValue="value"
							placeholder="Select a Status"
							class="w-full ml-2 md:ml-0"
						></p-dropdown>
					</template>
					<template #body="slotProps">
						<div class="center">{{ getStatusLabel(slotProps.data.priority) }}</div>
					</template>
				</p-column>

				<p-column field="isConfirmed" header="Confirmed" sortable style="width: 10%">
					<!-- <template #editor="{ data, field }" class="w-full">
						Add a checkbox here for dev to confirm
					</template>-->

					<template #body="slotProps" class="center">
						<div class="center">
							<fa v-if="slotProps.data.isConfirmed" :icon="['fas', 'check']" class="text-success"></fa>
							<fa v-else :icon="['fas', 'question']" class="text-secondary"></fa>
						</div>
					</template>
				</p-column>

				<p-column :rowEditor="true" style="width: 5%"></p-column>
			</p-data-table>
		</main>

		<!--
			HELP
			Hold meta key (Ctrl) to sort by multiple columns
		-->
	</div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const editingRows = ref([]);
const features = ref([
	{ "id": 1, "title": "Add a thing", "description": "Orange", "priority": 1, "isConfirmed": true },
	{ "id": 2, "title": "Change something there", "description": "Black", "priority": 1, "isConfirmed": true },
	{ "id": 3, "title": "Create a new something", "description": "Gray", "priority": 2, "isConfirmed": false },
	{ "id": 4, "title": "Remove the things", "description": "Blue", "priority": 3, "isConfirmed": true },
	{ "id": 5, "title": "If there's one thing that I think should go is the large titles or something else somewhere in this application", "description": "Orange", "priority": 2, "isConfirmed": false },
])
//date added


const statuses = ref([
	{ label: 'Low', value: 1 },
	{ label: 'Medium', value: 2 },
	{ label: 'High', value: 3 }
]);

const getStatusLabel = (status: number) => {
	switch (status) {
		case 1:
			return 'Low';

		case 2:
			return 'Medium';

		case 3:
			return 'High';

		default:
			return 'NA';
	}
};

function openFeatureModal() {
	
}

function getRowClass(data: any) {
	let rowClass = "";

	if (data.isConfirmed) {
		rowClass = "confirmed-feature"
	}

	return rowClass
}

function saveRowEdit(event: { newData: any; index: any; }) {
	features.value[event.index] = event.newData;
}
</script>

<style scoped lang="scss">
::v-deep(.confirmed-feature) {
	background-color: var(--green-300) !important;
}
</style>
