import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage').default
    },
    {
      path: '/study/all',
      name: 'study-all',
      component: require('@/components/StudyAllPage').default
    },
    {
      path: '/study/:id/detail',
      name: 'study-detail',
      component: require('@/components/StudyDetailPage').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
