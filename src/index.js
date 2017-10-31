import Vue from 'vue';
import Vuex from 'vuex';
import App from './components/App.vue';

import Store from './Store.js';

class Mounter{
    mountFlatcher(){
        const vm = new Vue(App)
        vm.$mount('#vue-app-container-1');
    }
}

window.mounter = new Mounter();

window.onload = ()=>{
    window.mounter.mountFlatcher();
}