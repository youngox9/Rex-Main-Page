import Vue from 'vue';
import Router from 'vue-router';
import homepage from '../containers/homepage';
import notfound from '../containers/notfound';
import about from '../containers/about';
Vue.use(Router);

export default new Router({
  // mode: 'history',
  routes: [{
      path: '/',
      name: 'homepage',
      component: homepage
    },
    {
      path: '/about',
      name: 'about',
      component: about
    },
    {
      path: '*',
      name: 'notfound',
      component: notfound
    },

  ],
});