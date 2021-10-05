<template>
	<n-config-provider :theme-overrides="themeOverrides">
		<div id="nav">
			<router-link to="/">Home</router-link>|
			<router-link to="/about">About</router-link>
		</div>
		<router-view />

		<div>
			<n-button>naive-ui</n-button>
			<HelloWorld location="Airidas.net"></HelloWorld>
		</div>
	</n-config-provider>
</template>

<script lang="ts" setup>
import { GlobalThemeOverrides } from "naive-ui";
import HelloWorld from "./components/HelloWorld.vue";

const themeOverrides: GlobalThemeOverrides = {
	common: {
		primaryColor: '#FFFF00',
		textColorBase: '#FFFF00',
		actionColor: '#FFFF00',
		bodyColor: '#FFFF00',
		textColor1: '#FFFF00',
		//textColor2: '#FFFF00', //Color of text inside button
		textColor3: '#FFFF00',
		//primaryColorHover: '#FFFF00', // On primary button hover
		hoverColor: '#FF0000',
	},
	Button: {
		//textColor: '#FFFF00'
	},
	Select: {
		/*
		peers: {
			InternalSelection: {
				textColor: '#FF0000'
			}
		}
		*/
	},
	// ...
}

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
