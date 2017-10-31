<template>
	<div class="request-settings">
		<span contenteditable="true"> <b>{{flow.name}}</b> </span>
		<form>
			<div>
				<label>
					<input type="radio" name="method" value="GET" v-model="method" />GET
				</label>
				<label>
					<input type="radio" name="method" value="POST" v-model="method" />POST
				</label>
				<label>
					<input type="radio" name="method" value="PUT" v-model="method" />PUT
				</label>
				<label>
					<input type="radio" name="method" value="DELETE" v-model="method" />DELETE
				</label>
			</div>

			<div>
				<label>
					<!-- Textarea -->
					<input type="radio" name="response" value="RAW" v-model="response" /> RAW
				</label>
				<label>
					<!-- JSON Brace -->
					<input type="radio" name="response" value="JSON" v-model="response" /> JSON
				</label>
				<label>
					<!-- HTML Brace -->
					<input type="radio" name="response" value="HTML" v-model="response" /> HTML
				</label>
			</div>

			<div class="url-container">
				<button class="button is-info request-settings__send-btn" @click="sendRequestClick" type=button> SEND </button>	
				<input type="text"  name="URL" v-model="url" class="input url-input" />			
			</div>

			<PostParams :flowID="flowID" />

		</form>
	</div>
</template>

<script>

import PostParams from './PostParams.vue';

const RequestSettings = {
	props: {
		flowID: { type: String, required: true }
	},
	components: {
		PostParams
	},
	computed: {
		flow(){
			return this.$store.getters.getFlow( this.flowID );
		},
		url: {
			get(){  
				return this.$store.getters.getFlow(this.flowID).url 
			},
			set(value){
				this.$store.commit('flow_updateURL', {fID: this.flowID, url: value} )
			}
		},
		method: {
			get(){ 
				return this.$store.getters.getFlow(this.flowID).method;
			},
			set(value){
				this.$store.commit('flow_updateMethod', {fID: this.flowID, method: value});
			}
		},
		response: {
			get(){
				return this.$store.getters.getFlow(this.flowID).responseFormat;
			},
			set(value){
				this.$store.commit('flow_updateResponseFormat', {fID: this.flowID, responseFormat: value});	
			}
		}
	},
	methods:{
		sendRequestClick(){
			const sendSettings = this.$store.getters.getPayloadToSend( this.flowID );
			sendSettings.fID = this.flowID;
			this.$store.dispatch( 'flow_sendRequest', sendSettings );
		}
	}
}

export default RequestSettings;

</script>

<style>
	.url-input{
		width: 500px;
	}
	.url-container{
		display: flex;
		flex-direction: row;
		margin-bottom: 2px;
	}
	.request-settings{
		padding-left: 15px;
	}
	.request-settings__send-btn{
		margin-right: 5px;
	}
</style>