<template>
	<div class="grid center text-primary">
		<span class="center-right col-4 lg:col-5">
			<p-button
				@click="onPreviousClicked()"
				:disabled="isPreviousDisabled"
				class="m-1">
				<fa :icon="['fas', 'chevron-left']"></fa>
			</p-button>
		</span>
		<div class="center col-4 md:col-3 lg:col-2">
			<p v-if="showCount">({{ totalItemsLoadedCountDisplayed }} of {{ totalAmount }})</p>
			<p v-else> --- </p>
		</div>
		<span class="center-left col-4 lg:col-5">
			<p-button
				@click="onNextClicked()"
				:disabled="isNextDisabled"
				class="m-1">
				<fa :icon="['fas', 'chevron-right']"></fa>
			</p-button>
		</span>
	</div>
</template>

<script setup lang="ts">
import { IBaseModel } from "@/models/BaseModel"
import Debugger from "@/utilities/debugger"
import { withDefaults, defineProps, computed, ComputedRef, Ref, ref, defineEmits, onMounted } from "vue"

/* ------------------- Props ----------------- */
export interface PaginatorMethods {
	reset(): void;
}

interface PropsInterface {
	data: IBaseModel[]
	totalAmount: number
	showCount?: boolean
	fallbackDocId?: string
}

const props = withDefaults(defineProps<PropsInterface>(), {
	showCount: true,
	fallbackDocId: ""
})

const emit = defineEmits<{
	(event: "interface", methods: PaginatorMethods): void,
	(event: "next", docIdStartAt: string): void,
	(event: "previous", docIdEndAt: string): void,
}>()

/* ------------------- Properties ----------------- */

const itemsPerPageCount: Ref<number> = ref(props.data.length)
const totalItemsLoadedCount: Ref<number> = ref(props.data.length)
const isLastPage: ComputedRef<boolean> = computed(() => totalItemsLoadedCount.value >= props.totalAmount)
const totalItemsLoadedCountDisplayed: ComputedRef<number> = computed(() => isLastPage.value ? props.totalAmount : totalItemsLoadedCount.value)

const isPreviousDisabled: ComputedRef<boolean> = computed(() => totalItemsLoadedCount.value - itemsPerPageCount.value <= 0)
const isNextDisabled: ComputedRef<boolean> = computed(() => totalItemsLoadedCountDisplayed.value === props.totalAmount || props.data.length === 0)

/* ------------------- Methods ----------------- */

function onPreviousClicked() {
	Debugger.Warn("Previous clicked!")
	totalItemsLoadedCount.value -= itemsPerPageCount.value

	const hasItemsOnPage = props.data.length > 0
	const documentId = hasItemsOnPage ? props.data[0].id : props.fallbackDocId

	if (hasItemsOnPage) {
		Debugger.Log(`Loading entries before id: ${documentId}`)
		return emit("previous", documentId)
	}

	Debugger.Log(`Loading entries start after id: ${documentId}`)
	return emit("next", documentId)
}

function onNextClicked() {
	Debugger.Warn("Next clicked!")
	totalItemsLoadedCount.value += itemsPerPageCount.value

	const documentId = props.data[props.data.length - 1].id
	Debugger.Log(`Loading entries start after id: ${documentId}`)
	emit("next", documentId)
}

function reset() {
	totalItemsLoadedCount.value = itemsPerPageCount.value
}

/* ------------------- Lifecycle ----------------- */
onMounted(() => {
	emit("interface", { reset: () => reset() })
})

</script>

<style scoped lang="scss">
</style>
