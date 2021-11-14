<template>
		<MainNavbar></MainNavbar>
		<router-view />
		<MainFooter></MainFooter>
	<!--
	<div>
		<p-button label="PrimeVue" icon="pi pi-user"></p-button>
			<HelloWorld location="Airidas.net"></HelloWorld>
		</div>
	-->
</template>

<script lang="ts" setup>
//import HelloWorld from "./components/HelloWorld.vue"
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
	height: 100%;
}
</style>
