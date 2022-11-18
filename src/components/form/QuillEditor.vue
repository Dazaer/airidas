<template>
	<p-editor v-model="innerModel" editorStyle="height: 320px" :readonly="isReadonly">

		<template v-if="isReadonly" #toolbar>
			<span class="ql-formats">
				<p class="text--mini text--darker">{{toolbarText}}</p>
			</span>
		</template>

		<template v-else #toolbar>
			<span class="ql-formats">
				<select class="ql-header"></select>
			</span>
			<span class="ql-formats">
				<button class="ql-bold"></button>
				<button class="ql-italic"></button>
				<button class="ql-underline"></button>
				<button class="ql-strike"></button>
			</span>
			<span class="ql-formats">
				<select class="ql-color ql-picker ql-color-picker"></select>
				<button class="ql-script" value="sub"></button>
				<button class="ql-script" value="super"></button>
			</span>
			<span class="ql-formats">
				<button class="ql-list" value="ordered"></button>
				<button class="ql-list" value="bullet"></button>
				<button class="ql-indent" value="-1"></button>
				<button class="ql-indent" value="+1"></button>
				<select class="ql-align ql-picker ql-icon-picker"></select>
			</span>
			<span class="ql-formats">
				<button class="ql-link"></button>
			</span>
			<span class="ql-formats">
				<button class="ql-clean"></button>
			</span>
		</template>

	</p-editor>
</template>

<script setup lang="ts">
import { withDefaults, defineProps, defineEmits, computed, ComputedRef, WritableComputedRef } from "vue"

/* ------------------- Props ----------------- */

interface PropsInterface {
	propModel: string;
	readonly?: boolean;
	/**
	 * Text to display in toolbar when readonly is set to true.
	 */
	toolbarText?: string;
}

const props = withDefaults(defineProps<PropsInterface>(), {
	propModel: "",
	readonly: false,
	toolbarText: "",
})

const emit = defineEmits<{
	(event: "changed", value: string): string,
}>()

/* ------------------- Properties ----------------- */

const isReadonly: ComputedRef<boolean> = computed(() => props.readonly)
const innerModel: WritableComputedRef<string> = computed({
	get() {
		return props.propModel
	},
	set(value: string) {
		emit("changed", value)
	}
})

</script>

<style scoped lang="scss">
</style>
