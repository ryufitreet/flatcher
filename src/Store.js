import Vue from 'vue';
import Vuex from 'vuex';

import {
	DEFAULT_METHOD,
	DEFAULT_URL,
	BACK_URL
} from './const.js';

Vue.use(Vuex);


const makeDefaultPostParams = ()=>{ 
	return {param: "", value: "", JSONBrace: false} 
};
const makeEmptyPostParam = ()=>{
	return { param: '', value:'', JSONBrace: false };
}
const makeDefaultFlow = ()=>{
	let METHOD, URL;
	
	if ( typeof Store != 'undefined' ){
		METHOD = Store.state.settings.METHOD;
		URL = Store.state.settings.URL;
	} else {
		METHOD = DEFAULT_METHOD;
		URL = DEFAULT_URL;
	}

	return { 
		name: '--flow--',
	 	method: METHOD, 
	 	url: URL, 
		responseStatus: 'empty', 
		responseFormat: 'JSON',
		responseBlockHeight: '350px'
	};
}

const formDataFromObject = ( obj )=>{
	const formdata = new FormData();
	
	for ( let p in obj ){
		formdata.append( p, obj[p] );
	}

	return formdata;
}

const serialiseGETParams = ( obj )=>{

}

const FLOW_UID_PREFIX = 'flow';
const POSTPARAMS_UID_PREFIX = 'postparam';

// Make uid based on timestamp and Prefix
const makeUid = (prefix)=>{
	const uid = Date.now();
	return `${prefix}_${uid}`;
};

const flowMutations = {
	flow_kill(state, fID){
		// Удаляем из IDшников
		state.flowsIDS = state.flowsIDS.filter( (item)=>{ return item!=fID; } );
		// Удаляем из объекта
		Vue.delete( state.flows, fID );
	},
	flow_add( state ){
		var uid = makeUid(FLOW_UID_PREFIX);
		Vue.set(state.flows, uid, makeDefaultFlow());
		const ppEmptyUid = makeUid( POSTPARAMS_UID_PREFIX );
		Vue.set(state.postParams, uid, { [`${POSTPARAMS_UID_PREFIX}_0`]:makeDefaultPostParams(), [ppEmptyUid]:makeEmptyPostParam() });
		state.flowsIDS.push( uid );
	},
	flow_updateURL(state, payload){
		const { fID, url } = payload;
		Vue.set( state.flows[fID], 'url', url );
	},
	flow_updateMethod(state, payload){
		const {fID, method} = payload;
		Vue.set( state.flows[fID], 'method', method );

	},
	flow_updateResponseFormat(state, payload){
		const { responseFormat, fID } = payload;
		Vue.set( state.flows[fID], 'responseFormat', responseFormat );
	},
	flow_updateName(state, payload){
		const {fID, name} = payload;
		Vue.set( state.flows[fID], 'method', name );	
	},
	flow_addPostParam(state, fID){
		if ( Object.keys(state.postParams[fID]).length > 10 )  return;
		const uid = makeUid(POSTPARAMS_UID_PREFIX);
		const emptyParam = { [uid]: makeEmptyPostParam() }
		// Make Flow with default one post and one empty
		state.postParams[fID] = Object.assign({}, state.postParams[fID], emptyParam);
	},
	flow_removePostParam(state, payload){
		const { fID, ppID } = payload;
		Vue.delete( state.postParams[fID], ppID );
	},
	flow_updatePostParamParam(state, payload){
		const {fID, ppID, param} = payload;
		Vue.set( state.postParams[fID][ppID], 'param', param );
	},
	flow_updatePostParamValue(state, payload){
		const {fID, ppID, value} = payload;

		if ( value.toLowerCase() == '#json#' && !state.postParams[fID][ppID].JSONBrace ) 
			Vue.set( state.postParams[fID][ppID], 'JSONBrace', true );

		Vue.set( state.postParams[fID][ppID], 'value', value );
	},
	flow_updateResponse( state, payload ){
		const { response, fID } = payload;
		Vue.set( state.flows[fID], 'responseStatus', 'print' );
		Vue.set( state.responses, fID, response );
	},
	flow_fetchResponse( state, payload ){
		const {fID} = payload;
		Vue.set( state.flows[fID], 'responseStatus', 'fetch' );
	},
	flow_updateReponseBlockHeight( state, payload ){
		const { fID, responseBlockHeight } = payload;
		Vue.set( state.flows[fID], 'responseBlockHeight', responseBlockHeight );
	}
}

const flowActions = {
	flow_sendRequest( { commit }, payload ){
		const {fID} = payload;
		delete payload.fID;

		commit('flow_updateResponse', { fID, response:false });
		commit('flow_fetchResponse', {fID});

		fetch( BACK_URL, {
			method: "POST",
			body: formDataFromObject(payload)
		})
		.then( response=>response.text() )
		.then(( response )=>{
			commit('flow_updateResponse', { fID, response });
		});
	}
}

const flowGetters = {
	getFlows:  state =>state.flows, 
	getFlowsIDS:  state =>state.flowsIDS, 
	getFlow: (state, fID)=> fID=>state.flows[fID],
	getPostParamsSet: (state, fID)=> (fID)=>state.postParams[fID],
	getPostParamRow: (state, fID, ppID)=> (fID, ppID)=>state.postParams[fID][ppID],
	getCountPostParamsFlow: (state, fID)=> (fID)=>state.postParams[fID].length,
	getResponse: (state, fID)=> (fID)=>state.responses[fID] || false,
	getPayloadToSend: (state, fID)=> (fID)=>{ 
			const { url, method } = state.flows[fID];
			let params = {};
			// Get array of POST params' objects where param is key and value is value 
			const postParamsKeys = Object.keys(state.postParams[fID]);
			postParamsKeys.forEach((ppID)=>{
				const { param, value } = state.postParams[fID][ppID];
				params[param] = value;
			});
			params = JSON.stringify( params );
			return  { url, method, params };
	},
	getMethod: (state, fID)=> (fID)=>{ console.log(state.flows[fID]); return state.flows[fID].method },
}

const settingsActions = {
	setSettings(state, payload ){
		const { method, URL } = payload;
		state.settings.method = method;
		state.settings.URL = URL;
	}
}

const Store = new Vuex.Store({
	state: {
		flows: {
			[`${FLOW_UID_PREFIX}_0`]:makeDefaultFlow(),
		},
		flowsIDS: [`${FLOW_UID_PREFIX}_0`],
		postParams: {
			// ID of Flow (unique for flows)
			[`${FLOW_UID_PREFIX}_0`]: {
				// ID of post param (unique for this object)
				[`${FLOW_UID_PREFIX}_0`]: { param: "api_key", value: "", JSONBrace: false },
			}
		},
		responses: {},
		settings: { 
			method: DEFAULT_METHOD,
			URL:DEFAULT_URL
		}
	},
	mutations: {
		...flowMutations,
		...settingsActions
	},
	actions:{
		...flowActions
	},
	getters: {
		...flowGetters		
	}
});

export default Store;