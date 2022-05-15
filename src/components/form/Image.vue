<template>
	<div class="image-container">
		<img
			v-if="imageUrl"
			class="image"
			:style="constructedStyle"
			:src="imageUrl"
			:alt="alt" />
	</div>
</template>

<script setup lang="ts">
import { withDefaults, defineProps, computed, ComputedRef } from "vue"

/* ------------------- Props ----------------- */

interface PropsInterface {
	url?: string;
	defaultUrl?: string;
	alt?: string;
	/**
	 * Size can be: sm, md, lg(default)
	 */
	size?: string;
}

const props = withDefaults(defineProps<PropsInterface>(), {
	url: "",
	defaultUrl: "https://www.pngkey.com/png/detail/233-2332677_image-500580-placeholder-transparent.png",
	alt: "image",
	size: "lg"
})

/* ------------------- Properties ----------------- */

const hasImage: ComputedRef<boolean> = computed(() => props.url.length > 0)
const imageUrl: ComputedRef<string> = computed(() => hasImage.value ? props.url : props.defaultUrl)
const widthSize: ComputedRef<string> = computed(() => {
	switch (props.size) {
	case "sm": {
		return "25%"
	}
	case "md": {
		return "50%"
	}
	case "lg":
	default:
		return "100%"
	}
})
const constructedStyle: ComputedRef<string> = computed(() => {
	return `
	width: ${widthSize.value};
	`
})



/* ------------------- Lifecycle ----------------- */
/*
onMounted(async () => {

});
*/

</script>

<style scoped lang="scss">
.image-container {
	display: flex;
	flex: 1 1 content;
	min-height: 0;
}

.image {
	max-height: 100%;
	object-fit: contain;
	width: 100%;
}

.image--default {
	background-color: rgba(255, 255, 255, 0.44);
}
</style>
