import Vue from 'vue'
import VueRouter from 'vue-router'
import 'bulma/css/bulma.css'
Vue.use(VueRouter)

import theCheckersComponent from './components/theCheckersComponent'
import theLifeComponent from './components/theLifeComponent';

const router = new VueRouter({
    mode: 'history',
    base: '/',
    routes: [
        {path: '/conway-checkers', component: theCheckersComponent},
        {path: '/conway-life', component: theLifeComponent},
    ],
});
import theWelcomePage from './components/theWelcomePage.vue';

new Vue({
  router,
  render: h => h(theWelcomePage),
}).$mount('#app')
