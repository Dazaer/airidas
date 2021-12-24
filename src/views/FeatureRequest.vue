<template>
	<div class="grid grid-nogutter col-12 md:col-10 md:col-offset-1 lg:col-8 lg:col-offset-2">
		<section class="grid grid-nogutter col-12 center">
			<h1 class="col-12">Feature Request</h1>

			<p class="col-12">
				Add, edit and delete features that you wish to be implemented in a future release.<br />
				One or more features may be implemented depending on their complexity and priority!
				<br /><br /><span class="text--mini">Upon a feature being confirmed, please contact the developer if you do not wish to have the feature implemented anymore, as its development might already be in progress.</span>
			</p>
		</section>

		<!-- Main container for feature development -->
		<main class="grid grid-nogutter col-12 container-box">
			<!-- <div class="col-12 center p-1">
				<fa :icon="['fas', 'spinner']" size="2x" spin class="m-1"></fa>
				<p class="font-italic">In development</p>
			</div> -->

			<p-toolbar class="mb-2 col-12 p-1">
				<template #start>
					<p-button @click="openDetailsModal()" label="New" icon="pi pi-plus" class="p-button-success"></p-button>
				</template>

				<!-- <template #end>
					<p-button label="Delete" icon="pi pi-trash" class="p-button-danger"></p-button>
				</template> -->
			</p-toolbar>

			<p-data-table
				:value="featureRequests"
				data-key="id"
				stripedRows
				sortMode="multiple"
				@row-edit-save="saveRowEdit"
				responsiveLayout="stack"
				breakpoint="720px"
				class="col-12"
			>
				<!--
				v-model:editingRows="editingRows"
				editMode="row"
				:rowClass="getRowClass"
				-->

				<p-column field="title" header="Title" style="width: 70%;">
					<template #header>
						<!-- <div class="text-secondary center w-full">
						Title
						</div>-->
					</template>
					<template #body="slotProps">
						<div class="pl-2 text-center md:pl-0 md:text-left w-full">{{ slotProps.data.title }}</div>
					</template>
				</p-column>

				<!-- <p-column field="description" header="Description" style="width: 80%">
					<template #body="slotProps">
						<div class="center">{{slotProps.data.description}}</div>
					</template>
				</p-column>-->

				<p-column field="priority" header="Priority" sortable style="width: 5%">
					<template #body="slotProps">
						<div class="center">{{ slotProps.data.priority.label }}</div>
					</template>
				</p-column>

				<p-column field="isConfirmed" header="Confirmed" sortable style="width: 5%">
					<template #body="slotProps">
						<div class="center">
							<fa v-if="slotProps.data.isConfirmed" :icon="['fas', 'check']" class="text-success"></fa>
							<fa v-else :icon="['fas', 'question']" class="text-secondary"></fa>
						</div>
					</template>
				</p-column>

				<!-- <p-column :rowEditor="true" style="width: 5%"></p-column> -->
				<p-column :exportable="false" style="width: 15%; justify-content: end;" body-class="text-center">
					<template #body="slotProps">
						<p-button icon="pi pi-pencil" class="p-button-rounded p-button-primary m-1" @click="openDetailsModal(slotProps.data.id)" />
						<p-button :disabled="slotProps.data.isConfirmed" icon="pi pi-trash" class="p-button-rounded p-button-danger m-1" @click="alert(`delete ${slotProps.data}`)" />
					</template>
				</p-column>
			</p-data-table>
		</main>

		<FeatureRequestDetailsModal
			:is-open="isDetailsOpen"
			:feature-request-id="selectedFeatureRequestId"
			@change-open-state="changeDetailsModalState"
		></FeatureRequestDetailsModal>

		<!--
			HELP
			Hold meta key (Ctrl) to sort by multiple columns
		-->
	</div>
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref } from "vue";
import { DataSnapshot, getDatabase, onValue, ref as firebaseRef } from "firebase/database";
import { getFirestore, collection, getDocs, doc, getDoc } from "firebase/firestore"
import FeatureRequestDetailsModal from "@/components/modals/FeatureRequestDetailsModal.vue";
import Priority from "@/models/Priority";
import snapshotToArray from "@/utilities/snapshotToArray";
import FeatureRequest from "@/models/FeatureRequest";
import querySnapshotToArray from "@/utilities/querySnapshotToArray";

/* ------------------- Properties ----------------- */
const db = getFirestore();

const isDetailsOpen = ref(false)
const selectedFeatureRequestId: Ref<string> = ref("")

//const editingRows = ref([]); //for row editing, probably to remove because we're editing in popup modal
const featureRequests: Ref<FeatureRequest[]> = ref([])

/* ------------------- Methods ----------------- */

async function getFeatureRequests() {
	const querySnapshot = await getDocs(collection(db, "feature-requests"));
	featureRequests.value = querySnapshotToArray(querySnapshot, "id")

const prios = doc(db, "priorities", "3");
const priosSnap = await getDoc(prios);
console.log(priosSnap)
let prioData = priosSnap.data() as Priority;
let priority = new Priority(prioData)
priority.id = priosSnap.id

featureRequests.value = featureRequests.value.map(fr => {
	fr.priority = priority
	return fr
})

}

function openDetailsModal(featureId: string = "") {
	selectedFeatureRequestId.value = featureId
	changeDetailsModalState(true)
}

function changeDetailsModalState(isOpening: boolean) {
	isDetailsOpen.value = isOpening
}

/*
//If I want to make the row a certain colour for example when confirmed, instead of having a checkmark there.
function getRowClass(data: any) {
	let rowClass = "";

	if (data.isConfirmed) {
		rowClass = "confirmed-feature"
	}

	return rowClass
}
*/

function saveRowEdit(event: { newData: any; index: any; }) {
	featureRequests.value[event.index] = event.newData;
}

/* ------------------- Lifecycle ----------------- */
onMounted(async () => {
	//const auth = getAuth(firebaseApp);
	await getFeatureRequests()
});

</script>

<style scoped lang="scss">
::v-deep(.confirmed-feature) {
	background-color: var(--green-300) !important;
}
</style>
