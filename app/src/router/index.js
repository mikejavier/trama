import Vue from 'vue';
import Router from 'vue-router';
import Splash from '@/components/Splash';
import Home from '@/components/Home';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/splash',
      name: 'Splash',
      component: Splash,
    },
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
  ],
});
