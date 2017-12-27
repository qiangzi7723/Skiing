import Vue from 'vue';
import Router from 'vue-router';
import Loading from '@/components/Loading';
import Game from '@/components/Game';

Vue.use(Router);

export default new Router({
	routes: [{
		path: '/',
		component: Loading,
	},{
        path:'/Game',
        component: Game
    }],
});
