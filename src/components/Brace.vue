<template>
	<div class="brace-code-editor__container" :id="'brace-code-editor__container'+DOMID" v-bind:style="{height: blockHeight}" >
		<div :id="DOMID" class="brace-code-editor__brace">
		</div>
	</div>
</template>

<script>

import * as brace from 'brace';
import 'brace/theme/monokai';
import 'brace/mode/json';
import 'brace/mode/html';

let editors={}, 
observers={};

const Brace = {
	props:{
		// Not used now
		syntax: { type: String, default: 'JSON' },
		text: { type: [String, Boolean], default: false },
		// UID for example
		UID: { type: [Boolean, String], default: false, required: false },
		blockHeight: { type: String, default: '350px' },
		readonly: { type: Boolean, default: false }
	},
	methods:{
		changeCode(){
			const value = editors[this.DOMID].getValue();
			this.$emit('change', value);
		},
		editorSetMode(){
			if ( this.syntax == 'JSON' ){
				editors[this.DOMID].getSession().setMode('ace/mode/json');
			} else {
				editors[this.DOMID].getSession().setMode('ace/mode/html');
			}
		}
	},
	watch:{
		syntax( val ){
			this.editorSetMode();
		}
	},
	mounted(){
		const _this = this;

		// Set Bracer
		editors[this.DOMID] = brace.edit(this.DOMID);
		
		this.editorSetMode();

		editors[this.DOMID].setTheme('ace/theme/monokai');
		editors[this.DOMID].getSession().on('change', this.changeCode);

		if ( this.readonly ) editors[this.DOMID].setOptions( {readOnly: true} );

		if ( this.text !== false ){
			editors[this.DOMID].setValue( this.text );
		}
		editors[this.DOMID].focus();

		// try handle resize via MutationObserver
		// need for correcting bracer editor when vertical resize
		const container = document.getElementById( 'brace-code-editor__container'+this.DOMID );

		observers[this.DOMID] = new MutationObserver(function( mutations ){
			mutations.forEach(( mutation )=>{
				if ( mutation.attributeName == "style" ) {
					editors[_this.DOMID].resize();
					if ( _this.UID ) {
						_this.$store.commit('flow_updateReponseBlockHeight', { 
							fID: _this.UID,
							responseBlockHeight: container.style.height 
						});
					}
				}
			});
		});

		var config = { attributes: true };
		observers[this.DOMID].observe( container, config );
		
	},
	data(){
		let uid;
		if ( !this.UID ){
			uid = 'bracecontainer_'+(Date.now());
		} else {
			uid = 'bracecontainer_'+(this.UID);
		}
		return { DOMID: uid };
	},
	destroyed(){
		observers[this.DOMID].disconnect();
	}
}

export default Brace;

</script>

<style>
	.brace-code-editor__container{
		width: 100%;
	    height: 300px;
	    resize: vertical;
	    overflow: auto;
	}
	.brace-code-editor__brace{
		width: 100%;
		height: calc(100% - 10px);
		min-height: 100px;
	}
</style>