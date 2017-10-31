<template>
	<div :class="$style.instance">
		<div :class="$style.instance__manage">
			<button class="button is-danger" :class="$style.instance__manageDeleteBtn" @click="killFlow" >
				<i class="fa fa-trash" ></i>
			</button>
			<RequestSettings :flowID="flowID" />
		</div>
		<div :class="$style.instance__responseContainer ">
			<div v-bind:class="[flow.responseStatus!='print' ? $style.flatcherResponseHidden :'']" >
				<RequestResponse :flowID="flowID" />
			</div>
			<div v-if="flow.responseStatus=='fetch'">
				<AnimateLoader />
			</div>
			<div v-if="flow.responseStatus=='empty' ">
				<span>No response yet</span>
			</div>
		</div>

	</div>
</template>

<script>

import AnimateLoader from './AnimateLoader.vue';
import RequestSettings from './RequestSettings.vue';
import RequestResponse from './RequestResponse.vue';

const FlatcherInstance = {
	props: {
		flowID: {
			type: String,
			required: true
		}
	},
	components:{
		RequestSettings,
		RequestResponse,
		AnimateLoader
	},
	computed: {
		flow(){
			return this.$store.getters.getFlow( this.flowID );
		}
	},
	methods: {
		killFlow(){
			this.$store.commit("flow_kill", this.flowID);
		}
	}
}

export default FlatcherInstance;

</script>

<style module>
.instance__manage{
	display:flex;
	flex-direction:row;
	margin-right: 10px;
}
.instance__manageDeleteBtn{
	margin-right: 10px;
}
.flatcherResponseHidden {
	display: none;
}
.instance{
	border: 1px solid #bbb;
	padding: 10px;
	display: flex;
	flex-direction: row;
}
.instance__responseContainer{
	width: 100%;
}
@media screen and (max-width: 900px){
	.instance {
		flex-direction: column;
	}
}
</style>