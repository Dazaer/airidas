<template>
	<div class="grid grid-nogutter col-12 md:col-10 md:col-offset-1 lg:col-8 lg:col-offset-2">
		<section class="grid grid-nogutter col-12 center">
			<h1 class="col-12">Recipes</h1>

			<p class="col-12">View and add recipes!</p>
		</section>
	</div>
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref } from "vue";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

/* ------------------- Properties ----------------- */
const toast = useToast();
const confirm = useConfirm();


/* ------------------- Methods ----------------- */



/* ------------------- Lifecycle ----------------- */


</script>

<style scoped lang="scss">
</style>
