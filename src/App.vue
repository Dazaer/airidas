<template>
	<n-config-provider :theme-overrides="themeOverrides" :theme="darkTheme">
		<!-- Home button -->
		<n-space>
			<n-menu v-model:value="activeKey" mode="horizontal" :options="menuOptions"></n-menu>
		</n-space>
		<!-- Profile button -->

		<router-view />

		<div>
			<n-button>naive-ui</n-button>
			<HelloWorld location="Airidas.net"></HelloWorld>
		</div>
	</n-config-provider>
</template>

<script lang="ts" setup>
import { GlobalThemeOverrides, darkTheme, NIcon } from "naive-ui";
import { RouterLink } from "vue-router";
import { h, ref } from "vue"
import HelloWorld from "./components/HelloWorld.vue";

const themeOverrides: GlobalThemeOverrides = {
	common: {
		//fontWeight: "600",
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


/*
function renderIcon (icon) {
	return () => h(NIcon, null, { default: () => h(icon) })
}
*/

const activeKey = ref(null)

const menuOptions = [
	{
		label: () =>
			h(
				RouterLink,
				{
					to: {
						name: 'Home',
						params: {
							lang: 'en-US'
						}
					}
				},
				{ default: () => 'Home' }
			),
		key: 'home',
		//icon: renderIcon(BookIcon),
		disabled: false,
		/*
		children: [
			{
				label: 'Rat',
				key: 'rat'
			}
		]
		*/
	},
	/*
	{
		label: () =>
			h(
				'a',
				{
					href: 'https://en.wikipedia.org/wiki/Hear_the_Wind_Sing',
					target: '_blank',
					rel: 'noopenner noreferrer'
				},
				'Hear The Wind'
			),
		key: 'hear-the-wind-sing',
	},
	*/
	{
		label: () =>
			h(
				RouterLink,
				{
					to: {
						name: 'About',
					}
				},
				{ default: () => 'About' }
			),
		key: 'about',
	},
	{
		label: 'Feature Request',
		key: 'feature-request',
	},
	{
		label: 'Login',
		key: 'login',
	},
	{
		label: 'Profile',
		key: 'profile',
		disabled: true,
		children: [
			{
				//type: 'group',
				label: 'Settings',
				key: 'settings',
			},
			{
				label: 'Logout',
				key: 'logout'
			}
		]
	}
]

</script>

<style lang="scss">

#app {
	font-family: "Butler", 'Segoe UI', 'Lucida Sans Unicode', Verdana;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	//font-weight: 500;
	font-size: 30px;
	//height: 100%;
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
