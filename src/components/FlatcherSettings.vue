<template>
	<div class="modal modal__background" v-on:click.self="onClose">
		<div class="modal__wrapper">
			<div class="modal__header">
				<b>Settings</b>
				<div class="modal__close-btn" @click="this.onClose">
					<i class="fa fa-times" aria-hidden="true"></i>
				</div>
			</div>
			<div class="modal__content">
				<div class="modal__content-row">
					<div class="modal__content-row-title">
						<span>Default Method</span>
					</div>
					<div class="modal__content-row-title-input">
						<select class="select" v-model="method">
							<option value="GET">GET</option>
							<option value="POST">POST</option>
							<option value="PUT">PUT</option>
							<option value="DELETE">DELETE</option>
						</select>
					</div>
				</div>
				<div class="modal__content-row">
					<div class="modal__content-row-title">
						<span>Default URL</span>
					</div>
					<div class="modal__content-row-title-input">
						<input type="text" class="input" v-model="URL" />
					</div>
				</div>
			</div>
			<div class="modal__footer">
				<button class="button is-info" v-on:click="save">Save</button>
				<button class="button is-danger" v-on:click="onClose">Cancel</button>
			</div>
		</div>	
	</div>
</template>

<script>
	
const  FlatcherSettings = {
	props: {
		onClose: { type: Function, required: true },
		onSave: { type: Function, required: true },
	},
	data(){

		return {
			method: this.$store.state.settings.method,
			URL: this.$store.state.settings.URL
		}
	},
	methods:{
		save(){
			this.onSave({
				method:this.method,
				URL:this.URL
			});
		}
	}
}
export default FlatcherSettings;

</script>

<style>
	.modal{
		display: block;
	}
	.modal__wrapper{
		border: 2px solid #bbb;
		position: absolute;
		width: 400px;
		height: auto;
		top: 30%;
		left: calc(50% - 200px);
		background-color: #fff;
	}
	.modal__background{
		position: absolute;
		height: 100%;
		width: 100%;
		background-color: rgba(0,0,0,.4);
	}
	.modal__header{
		text-align: center;
		position: relative;
		padding-top: 5px;
	}
	.modal__close-btn{
	    position: absolute;
	    right: 3px;
	    top: 2px;
	    cursor: pointer;
	}
	.modal__close-btn:hover i{
		color: #bbb;
	}
	.modal__content{
		padding-left: 20px;
		padding-top: 20px;
		padding-right: 20px;
		padding-bottom: 20px;
	}
	.modal__content .modal__content-row {
		margin-bottom: 10px;
	}
	.modal__content .modal__content-row:last-child{
		margin-bottom: 0px;
	}

	.modal__content-row div{
		display: inline-block
	}
	.modal__content-row-title {
		width: 40%;
		min-width: 130px;
	}
	.modal__content-row-title-input input, .modal__content-row-title-input select{
		vertical-align: baseline;
	}
	.modal__footer{
		text-align: center;
		border-top: 1px solid #eee;
		padding-top: 10px;
		padding-bottom: 10px;
		background-color: rgba(241, 228, 228, 0.1);
	}
	.modal__footer button:first-child{
		margin-right: 15px;
	}
</style>

