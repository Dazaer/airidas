<template>
	<div id="app">
		<h2>Homepage</h2>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
  components: {
  },
		setup() {


		return {
		};
	},
});
</script>

<style lang="less">
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	background: black;
	overflow: auto;
	color: blanchedalmond;
	height: 100%;
	//margin-top: 60px;
	font-size: 1rem;
}

body {
	height: 100vh;
	margin: 0;
}
</style>
