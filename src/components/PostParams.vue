<template>
	<div class="post-params">
		<button type="button" class="button post-params__add-btn" @click="addRow">
			<i class="fa fa-plus"></i>
		</button>
		<div v-for="pp in Object.keys(postParamsSet)" :key="pp" class="post-params__values">
			<PostParamRow 
				:flowID="flowID" :ppID="pp"
				@changeValue="changeValue"
				@changeParam="changeParam"
				@removeRow="removeRow" />
		</div>
	</div>
</template>

<script>

import Brace from './Brace.vue';
import PostParamRow from './PostParamRow.vue';

const PostParams = {
	props: {
		flowID: { 
			type: String, 
			required: true
		}
	},
	components: {
		Brace,
		PostParamRow
	},
	computed: {
		postParamsSet(){ 
			return this.$store.getters.getPostParamsSet(this.flowID);
		},
	},
	methods: {
		addRow(){
			this.$store.commit( "flow_addPostParam", this.flowID );
		},
		removeRow( ppID ){
			this.$store.commit("flow_removePostParam", { fID: this.flowID, ppID: ppID });
		},
		changeParam( param, ppID ){
			this.$store.commit( "flow_updatePostParamParam", {fID: this.flowID, ppID, param} );
		},
		changeValue( value, ppID ){
			this.$store.commit( "flow_updatePostParamValue", {fID: this.flowID, ppID, value} );
		}
	}
}

export default PostParams;

</script>


<style>
.post-params {
	position: relative;
}
.post-params__add-btn{
	position: absolute;
	left: -40px;
}

.post-params__values {
	display: flex;
	flex-direction: row;
}
.post-params-input{
	width: 250px;
}

</style>