import 'babel-polyfill';
import Vue from 'vue';
import App from './App';
import ElementUI from 'element-ui';
import '../static/style.css';
import'element-ui/lib/theme-default/index.css';
import 'font-awesome/css/font-awesome.min.css';

import VueRouter from 'vue-router';
import Vuex  from 'vuex';
import store from './store/';//本地存储
import {storage}  from 'utils';
// chartjs package
require('chart.js');
// vue-charts package
require('hchs-vue-charts');

Vue.use(VueCharts);
Vue.use(Vuex);
Vue.use(ElementUI);
Vue.use(VueRouter);

import routes from './routes.js';

//页面顶部进度条
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const router = new VueRouter(routes);

router.beforeEach((to, from, next) => {
    window.scroll(0,0);
    NProgress.start();
    next();
});

router.afterEach(() => {
    NProgress.done();
});

new Vue({
    router,
    store,
    'render': h => h(App)
}).$mount('#app');
