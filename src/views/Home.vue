<template>
	<div class="home">
		<h2>Homepage</h2>
	</div>
</template>

<script>
// @ is an alias to /src
import { reactive } from "vue";

export default {
	name: "Home",

	setup() {
		const state = reactive({
		});

		return {
			state,
		};
	}
};
</script>

<style lang="scss" scoped>
.home{
	background: black;
	color: blanchedalmond;
}
</style>
