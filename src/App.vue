<template>
	<div class="flex flex-column min-h-screen">
		<MainNavbar></MainNavbar>
		<div class="flex-1">
			<router-view />
		</div>
		<MainFooter></MainFooter>
	</div>

	<p-toast position="top-right" :auto-z-index="false" :base-z-index="10" style="z-index: 99999;" />
</template>

<script lang="ts" setup>
import MainNavbar from "@/views/MainNavbar.vue"
import MainFooter from "@/views/MainFooter.vue"


</script>

<style lang="scss">
#app {
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;

	//text-align: center;
	//font-family: 'Segoe UI', 'Lucida Sans Unicode', Verdana; //using this does not apply to the theme from primevue
	//font-size: medium;
	height: auto;
	min-height: 100vh;
}
</style>
