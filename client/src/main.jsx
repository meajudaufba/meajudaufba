//import 'whatwg-fetch';
import React from 'react';
import {render} from 'react-dom';
import { Router, Route, IndexRedirect, Link, browserHistory } from 'react-router';

import AppComponent from './components/app.jsx';
import MainLayoutComponent from './components/main-layout.jsx';
import CoursesContainerComponent from './components/courses.container.jsx';
import LoginComponent from './components/login.jsx';

import Auth from './services/auth.jsx';


function requireAuth(nextState, replace) {
    if (!Auth.loggedIn()) {
        replace({
            pathname: '/login',
            state: {
                nextPathname: nextState.location.pathname
            }
        })
    }
}

render((
	<Router history={browserHistory}>
    	<Route path="/" component={AppComponent}>
            <IndexRedirect to="/disciplinas" />
    		<Route component={MainLayoutComponent}>                
    			<Route path="disciplinas" onEnter={requireAuth} component={CoursesContainerComponent} />
    		</Route>
    	</Route>
    	<Route path="/login" component={LoginComponent} />
    </Router>
), document.getElementById('app'));