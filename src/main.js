import Vue from 'vue'
import VueRouter from 'vue-router'
import router from './router'
import App from './App'
import "../scss/style.scss";
Vue.use(VueRouter)

new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: {
        App,
    }
});