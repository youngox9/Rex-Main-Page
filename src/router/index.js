import Vue from 'vue';
import Router from 'vue-router';
import homepage from '../containers/homepage';
import notfound from '../containers/notfound';

Vue.use(Router);

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'homepage',
      component: homepage
    },
    {
      path: '*',
      name: 'notfound',
      component: notfound
    },
  ],
});
