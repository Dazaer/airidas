<template>
	<p-dialog
		header="Feature details"
		:visible="isOpen"
		@show="loadFeatureDetails"
		@update:visible="changeOpenState"
		position="top"
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
						id="featureTitle"
						v-model="validation.title.$model"
						type="text"
						:autofocus="props.featureRequestId == ''"
						:class="{ 'p-invalid': validation.title.$invalid && hasBeenSubmitted }"
						:disabled="featureRequestDetails.isConfirmed"
						class="w-full"
					/>
					<label for="featureTitle" :class="{ 'p-error': validation.title.$invalid && hasBeenSubmitted }">Title</label>
				</div>

				<small
					v-if="validation.title.$invalid && hasBeenSubmitted"
					class="p-error"
				>{{ validation.title.required.$message.replace('Value', 'Title') }}</small>
			</div>

			<!-- Description Input -->
			<div class="field col-12">
				<div class="p-float-label">
					<p-textarea id="featureDescription" v-model="validation.description.$model" :autoResize="true" rows="5" cols="30" />
					<label for="featureDescription" :class="{ 'p-error': validation.description.$invalid && hasBeenSubmitted }">Description</label>
				</div>
			</div>

			<!-- Priority Input -->
			<div class="field col-12">
				<div class="p-float-label">
					<p-dropdown
						id="featurePriority"
						v-model="validation.priority.$model"
						:options="priorities"
						optionLabel="label"
						placeholder="Select a priority"
					>
						<template #value="slotProps">
							<div v-if="slotProps.value.id != ''">
								<div>{{ slotProps.value.label }}</div>
							</div>
							<span v-else>{{ slotProps.placeholder }}</span>
						</template>
						<template #option="slotProps">
							<div>
								<div>{{ slotProps.option.label }}</div>
							</div>
						</template>
					</p-dropdown>
					<label for="featurePriority" :class="{ 'p-error': validation.priority.$invalid && hasBeenSubmitted }">
						<span v-if="validation.priority.$model != null">Priority</span>
					</label>
				</div>

				<small
					v-if="validation.priority.$invalid && hasBeenSubmitted"
					class="p-error"
				>{{ validation.priority.required.$message.replace('Value', 'Priority') }}</small>
			</div>
		</article>

		<template #footer>
			<p-button label="Save" icon="pi pi-check" @click="saveFeatureRequest()" class="p-button-success" />
			<p-button label="Cancel" icon="pi pi-times" @click="isVisible = false" class="p-button-text" />
		</template>
	</p-dialog>
</template>

<script setup lang="ts">
import firebaseApp from "@/utilities/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { DataSnapshot, getDatabase, onValue, ref as firebaseRef } from "firebase/database";
import { getFirestore, collection, getDocs, query, where, doc, getDoc } from "firebase/firestore"
import { withDefaults, defineProps, defineEmits, computed, reactive, onMounted, Ref, ref as ref } from 'vue'
import { required } from '@vuelidate/validators'
import useVuelidate from "@vuelidate/core";
import { FirebaseError } from "firebase/app";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import { RouteNames } from "@/router";
import FeatureRequest from "@/models/FeatureRequest";
import Priority from "@/models/Priority";
import snapshotToArray from "@/utilities/snapshotToArray";
import querySnapshotToArray from "@/utilities/querySnapshotToArray";

/* ------------------- Props ----------------- */

interface propsInterface {
	isOpen?: boolean
	featureRequestId: string
}
const props = withDefaults(defineProps<propsInterface>(), {
	isOpen: false,
});

const emit = defineEmits<{
	(event: 'change-open-state', isOpen: boolean): void,
}>();


/* ------------------- Properties ----------------- */

const toast = useToast();
const auth = getAuth(firebaseApp)
//const db = getDatabase();
const db = getFirestore();
const router = useRouter()


const isVisible = computed({
	get() {
		return props.isOpen
	},
	set(value: boolean) {
		emit("change-open-state", value)
	}
})

const priorities: Ref<Priority[]> = ref([]);

const featureRequestDetails: Ref<FeatureRequest> = ref(new FeatureRequest())
const rules = {
	title: { required },
	description: {},
	priority: { required },
	isConfirmed: {},
}
const validation = useVuelidate(rules, featureRequestDetails)
const hasBeenSubmitted = ref(false)

/* ------------------- Methods ----------------- */

function changeOpenState(isOpen: boolean) {
	isVisible.value = isOpen
}

async function loadFeatureDetails() {

if (props.featureRequestId == "") {
	return featureRequestDetails.value = new FeatureRequest()
}

console.log(props.featureRequestId)
const docRef = doc(db, "feature-requests", props.featureRequestId);
const docSnap = await getDoc(docRef);
featureRequestDetails.value = docSnap.data() as FeatureRequest

console.log(featureRequestDetails.value.priority)

const prios = doc(db, "priorities", "3");
const priosSnap = await getDoc(prios);
console.log(priosSnap)
let prioData = priosSnap.data() as Priority;
let priority = new Priority(prioData)
priority.id = priosSnap.id

console.log(prioData)
console.log(priority)
console.log(featureRequestDetails.value.priority.id)
console.log(featureRequestDetails.value.priority.label)
featureRequestDetails.value.priority = priority
/*

const featureRequestsRef = collection(db, "feature-requests");
console.log(featureRequestsRef);
console.log(featureRequestsRef.id);
// Create a query against the collection.
const q = query(featureRequestsRef, where("priority", "==", "priorities/1"));
console.log(q);

const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) => {
	console.log(doc.id, " => ", doc.data());

});

	*/
	/*
	const existingFeatureRequest = features.value.find(feature => feature.id === props.featureRequestId)

	featureRequestDetails.value = existingFeatureRequest ?? new FeatureRequest()
	validation.value.$model = featureRequestDetails.value
	*/
}
/*
function getPriorities() {
	const prioritiesRef = firebaseRef(db, 'priorities/');

	onValue(prioritiesRef, (snapshot: DataSnapshot) => {
		priorities.value = snapshotToArray(snapshot, 'id')
	});
}
*/

async function getPriorities() {
	const querySnapshot = await getDocs(collection(db, "priorities"));
	priorities.value = querySnapshotToArray(querySnapshot, "id")
}

function saveFeatureRequest() {
	alert("Functionality soon to be available!")
}

/* ------------------- Lifecycle ----------------- */
onMounted(async () => {
	//const auth = getAuth(firebaseApp);
	getPriorities()
});

</script>

<!-- Cannot use scoped here as it won't affect the modal -->
<style lang="scss">
</style>
