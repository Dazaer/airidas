<template>
<div>
<!-- Currently not a needed feature, should remain untouched until necessary -->
</div>
</template>

<script setup lang="ts">
import {withDefaults, defineProps, defineEmits} from "vue"

interface propsInterface {
	isOpen?: boolean;
}
const props = withDefaults(defineProps<propsInterface>(), {
	isOpen: false,
})

const emit = defineEmits<{
  (event: "change-open-state", test: string): void,
}>()

let isVisible = true


function changeOpenState(username: string) {
	emit("change-open-state", username)
}

</script>

<style scoped lang="scss">
</style>
