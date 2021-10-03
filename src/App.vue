<template>
	<div id="nav">
		<router-link to="/">Home</router-link>|
		<router-link to="/about">About</router-link>
	</div>
	<router-view />
	<div>
		<HelloWorld location="Airidas.net"></HelloWorld>
	</div>
</template>

<script lang="ts" setup>
import HelloWorld from "./components/HelloWorld.vue";
</script>

<style lang="scss">
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: $FONT_COLOR;
	background-color: $BODY_BACKGROUND_COLOR;
	height: 100%;
}

#nav {
	padding: 30px;

	a {
		font-weight: bold;
		color: #2c3e50;

		&.router-link-exact-active {
			color: #42b983;
		}
	}
}
</style>
