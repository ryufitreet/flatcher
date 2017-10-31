<template>
	<div class="post-param">
		<div class="post-param__inputs-container">
			<button class="button post-params__delete-btn" type=button @click="removeRow" > 
				<i class="fa fa-trash"></i>
			</button>
			<input type="text" name="value" placeholder="param" 
				class="input post-params-input post-param__param" 
				:value="postParamRow.param" v-on:input="changeParam($event.target.value)" />
			<input v-if="!postParamRow.JSONBrace" type="text" name="value" placeholder="value" 
				class="input post-params-input post-param__value" 
				:value="postParamRow.value" v-on:input="changeValue($event.target.value)" />
		</div>
		<div class="post-param__brace-container">
			<Brace v-if="postParamRow.JSONBrace" v-on:change="changeValue">
			</Brace>
		</div>
	</div>

</template>

<script>
import Brace from './Brace.vue';

const PostParamRow = {
	props:{
		flowID: {type: String, required:true},
		ppID: {type: String, required:true}
	},
	components: {
		Brace
	},
	computed: {
		postParamRow(){ 
			const row = this.$store.getters.getPostParamRow( this.flowID, this.ppID );
			return row; 
		}
	},
	methods: {
		changeParam( param ){ this.$emit('changeParam', param, this.ppID) },
		changeValue( value ){ this.$emit('changeValue', value, this.ppID) },
		removeRow(){ this.$emit('removeRow', this.ppID) }
	}

}
export default PostParamRow;
</script>

<style>
	.post-param{
		display: flex;
    	flex-direction: column;
    	width: 100%;
    	margin-bottom: 2px;
    }
    .post-param__brace-container{
    	padding-left: 55px;
    }
    .post-param__inputs-container{
    	display: flex;
    	flex-direction: row;
    	margin-bottom: 2px;
    }
   	.post-params__delete-btn{
		margin-left: 20px;
		margin-right: 5px;
	}

</style>