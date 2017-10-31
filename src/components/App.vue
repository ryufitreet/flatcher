<template>
	<Flatcher />
</template>

<script>
	import store from '../Store.js';
	import Flatcher from './Flatcher.vue';
	const App = {
		store,
		components:{Flatcher}
	};
	export default App;
</script>