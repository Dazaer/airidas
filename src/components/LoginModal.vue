<template>
	<p-dialog
		header="Login"
		:visible="isOpen"
		@update:visible="changeOpenState"
		position="top"
		:displayPosition="true"
		:modal="true"
		:dismissableMask="true"
		:draggable="false"
		:closable="true"
		:breakpoints="{'1080px': '75vw', '640px': '100vw'}"
		:style="{ width: '40vw' }"
	>
		Hello, please login.
		<template #footer>
			<p-button label="Cancel" icon="pi pi-times" @click="isVisible = false" class="p-button-text" />
			<p-button label="Confirm" icon="pi pi-check" @click="login()" autofocus />
		</template>
	</p-dialog>
</template>

<script setup lang="ts">
import firebaseApp from "@/utilities/firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { withDefaults, defineProps, defineEmits, computed } from 'vue'

interface propsInterface {
	isOpen?: boolean;
}
const props = withDefaults(defineProps<propsInterface>(), {
	isOpen: false,
});

const emit = defineEmits<{
	(event: 'change-open-state', isOpen: boolean): void,
}>();

/* Properties */

const isVisible = computed({
	get() {
		return props.isOpen
	},
	set(value: boolean) {
		emit("change-open-state", value)
	}
})

/* Methods */
async function login() {
	const auth = getAuth(firebaseApp)
	const userCredentials = await signInWithEmailAndPassword(auth, "karolisvicius@gmail.com", "password")

	console.log(userCredentials.user.email)
	changeOpenState(false)
}

function changeOpenState(isOpen: boolean) {
	isVisible.value = isOpen
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
</style>
