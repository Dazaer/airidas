<template>
	<div>
		<h5>{{ location }}</h5>
	</div>
</template>

<script setup lang="ts">
import {withDefaults, defineProps} from 'vue'
interface propsInterface {
	location?: string;
}

const props = withDefaults(defineProps<propsInterface>(), {
	location: "Default - Hello world",
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
</style>
