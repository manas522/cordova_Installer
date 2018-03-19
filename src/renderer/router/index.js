import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage/LandingPage').default,
    },
    {
      path: '/prerequisites',
      name: 'Prerequisites-page',
      component: require('@/components/PrerequisitesPage/prerequisites').default,
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});
