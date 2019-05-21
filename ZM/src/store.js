import Vue from 'vue'
import Vuex from 'vuex'
// 用用到状态管理的注意格式保持一致，写清注释
Vue.use(Vuex)
// "SHOW_CHOOSE_CITY"显示选择城市组件
export default new Vuex.Store({
    state: {
        choose_city: false,    //是否显示选择城市组件
        address: '',           //选择城市化保存所选地址
        classifyState: {            //分类对象   
            isClassify: false,  //是否显示分类
            isLoadClassify: true,//是否刷新分类 true刷新/false不刷新
            largeName: '',  //已选分类大类
            smallName:''//已选分类小类
        },
        choose_audio: false,//是否显示选择音频组件
        musicClass: '音频分类',
    },
    mutations: {
        SHOW_CHOOSE_CITY: (state, payload) => {
            state.choose_city = payload.chooseCity;
            state.address = payload.address;
        },
        CLEAR_ADDRESS: (state) => {
            state.address = ''    //清空地址
        },
        SHOW_CLASSIFY: (state, payload) => {
            state.classifyState.isClassify = payload.isClassify;
            state.classifyState.isLoadClassify = payload.isLoadClassify;
            state.classifyState.largeName = payload.largeName;
            state.classifyState.smallName = payload.smallName;
        },
        SHOW_CHOOSE_AUDIO: (state, payload) => {
            state.choose_audio = payload.chooseAudio
            state.musicClass = payload.musicClass
        },
    },
    actions: {
        SHOW_CHOOSE_CITY: ({ commit, state }, payload) => {
            commit('SHOW_CHOOSE_CITY', payload)
        },
        CLEAR_ADDRESS: ({ commit }) => {
            commit('CLEAR_ADDRESS')
        },
        SHOW_CHOOSE_AUDIO: ({ commit, state }, payload) => {
            commit('SHOW_CHOOSE_AUDIO', payload)
        },
    },
    getters: {
        choose_city: (state) => {
            return state.choose_city;
        },
        address: (state) => {
            return state.address;
        },
        classifyState: (state) => {
            return state.classifyState;
        },
        choose_audio: (state) => {
            return state.choose_audio
        },
        musicClass: (state) => {
            return state.musicClass
        },
    }
})
