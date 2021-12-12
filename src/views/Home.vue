<template>
	<div class="grid grid-nogutter col-12 md:col-8 md:col-offset-2 lg:col-4 lg:col-offset-4">
		<h1 class="col-12 center">A place for many things</h1>

		<!-- Main container for home -->
		<main class="grid grid-nogutter col-12">
			<div class="col-12 center p-1 container-icons">
				<fa :icon="['fas', 'utensils']" size="2x" class="m-1"></fa>
				<fa :icon="['fas', 'flask']" size="2x" class="m-1"></fa>
				<fa :icon="['fas', 'camera']" size="2x" class="m-1"></fa>
				<fa :icon="['fas', 'music']" size="2x" class="m-1"></fa>
				<fa :icon="['fas', 'desktop']" size="2x" class="m-1"></fa>
				<fa :icon="['fas', 'book']" size="2x" class="m-1"></fa>
			</div>
		</main>
	</div>
</template>

<script lang="ts" setup>


</script>

<style scoped lang="scss">

.container-icons {
	color: var(--text-color);
}
</style>
