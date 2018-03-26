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
      path: '/install/java',
      name: 'install-java-page',
      component: require('@/components/InstallerPage/java').default,
    },
    {
      path: '/install/gradle',
      name: 'install-gradle-page',
      component: require('@/components/InstallerPage/gradle').default,
    },
    {
      path: '/install/cordova',
      name: 'install-cordova-page',
      component: require('@/components/InstallerPage/cordova').default,
    },
    {
      path: '/install/android',
      name: 'install-android-page',
      component: require('@/components/InstallerPage/android').default,
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
