<template>
    <div>
    	<h1 class="flatcher-header">
            <b>FLATCHER</b>
        </h1>

        <div class="app-container">
            <button class="button flatcher-settings-btn" @click="showSettings">Settings</button>
            <button class="button add-flow-btn" @click="addFlow"> <i class="fa fa-plus"></i> flow </button>
            <div v-for="fID in flowsIDS" :key="fID">
        	   <FlatcherInstance :flowID="fID" />
            </div>
            <div v-if="settingsModalShowed">
                <FlatcherSettings 
                    :onSave="onSaveSettings"
                    :onClose="closeSettings" />
            </div>
        </div>
    </div>
</template>

<script>

import FlatcherInstance from './FlatcherInstance.vue';
import FlatcherSettings from './FlatcherSettings.vue';

const Flatcher = {
    data(){
        return {
            settingsModalShowed: false
        };
    },
    computed: {
        flowsIDS(){
            return this.$store.getters.getFlowsIDS;
        },
    },
    methods:{
        addFlow(){
            this.$store.commit("flow_add");
        },
        showSettings(){
            this.settingsModalShowed = true;
        },
        closeSettings(){
            this.settingsModalShowed = false;
        },
        onSaveSettings( payload ){ 
            const { method, URL } = payload;
            this.$store.commit( 'setSettings', payload );
            this.closeSettings();
        }
    },
    components: {
        FlatcherInstance, 
        FlatcherSettings
    }
}

export default Flatcher;

</script>

<style>
    .add-flow-btn i{
        margin-right: 5px;
    }
    .flatcher-header{
        padding: 5px;
        border-bottom: 1px solid #eee;
        background: #000; 
        color: #aaa;
    }
    .app-container{
        padding: 10px;
    }
    .flatcher-settings-btn{
        display: block;
    }
</style>