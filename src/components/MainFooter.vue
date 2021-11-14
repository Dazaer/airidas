
<template>
	<footer class="flex justify-content-center p-3">
		<p-button
			@click="openUrl('https://www.facebook.com/Airidas.Dapkevicius')"
			icon="pi pi-facebook"
			class="mx-1 p-button-rounded p-button-primary p-button-outlined"
		/>

		<p-button
			@click="openUrl('https://www.linkedin.com/in/airidas-dapkevicius-69411723/')"
			class="mx-1 p-button-rounded p-button-primary p-button-outlined"
		>LinkedIn</p-button>
	</footer>
</template>

<script lang="ts" setup>
const openUrl = function (url: string) {
	window.open(url)
}
// @ is an alias to /src
</script>

<style scoped lang="scss">

</style>
