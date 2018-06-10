import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
import userInfo from './userInfo'
import commonVux from './commonVux'
module.exports = new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    modules: {
        userInfo,
        commonVux
    }
});
