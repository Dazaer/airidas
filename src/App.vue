<template>
	<div class="flex flex-column min-h-screen">
		<MainNavbar></MainNavbar>
		<div class="flex-1">
			<router-view />
		</div>
		<MainFooter></MainFooter>
	</div>

	<p-toast position="top-center" :auto-z-index="false" :base-z-index="10" />
</template>

<script lang="ts" setup>
import MainNavbar from "./components/MainNavbar.vue"
import MainFooter from "./components/MainFooter.vue"


</script>

<style lang="scss">
#app {
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;

	//text-align: center;
	//font-family: "Butler", 'Segoe UI', 'Lucida Sans Unicode', Verdana;
	//font-size: medium;
	height: auto;
	min-height: 100vh;
}
</style>
