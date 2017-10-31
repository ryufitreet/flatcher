<template>
	<div class="request-response">
		<div v-if="responseFormat=='RAW'">
			<textarea class="textarea" v-bind:style="{height: flow.responseBlockHeight }">{{ response }}</textarea>
		</div>

		<div class="request-response__brace-container" v-if="response && responseFormat!='RAW'" >
			<Brace 
				:text="response" 
				:syntax="responseFormat" 
				:UID="this.flowID" 
				:blockHeight="flow.responseBlockHeight"
				:readonly="true" >
			</Brace>
		</div>

	</div>
</template>

<script>
	
import Brace from './Brace.vue';

const RequestResponse = {
	components: {
		Brace
	},
	props: {
		flowID : { type: String, required: true }
	},
	computed: {
		response(){
			const response = this.$store.getters.getResponse(this.flowID);
			if ( !response  ) {
				return false;
			} else {
				try {
					return JSON.stringify(JSON.parse(response), null, "\t");
				} catch (e){
					return response;
				}
			}
		},
		responseFormat(){ 
			return this.$store.getters.getFlow( this.flowID ).responseFormat 
		},
		flow(){
			return this.$store.getters.getFlow(this.flowID);
		}
	},
	updated(){
	}

}
export default RequestResponse;
</script>

<style>
.request-response__brace-container{

}
</style>