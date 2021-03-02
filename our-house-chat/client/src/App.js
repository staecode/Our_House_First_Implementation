import * as React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";

import InitNavbar from './components/initnavbar.component';
import Navbar from './components/navbar.component';
import SignUp from './components/signup.component';
import SignIn from './components/signin.component';
import Welcome from './components/welcome.component';
import Foyer from './components/foyer.component';
import LogOut from './components/logout.component';

function App() {
    return ( 
        <div className='container'>
            <Router>
                <Route exact path={['/', '/signup', '/signin']} component={InitNavbar}/>
                <br />
                <Route exact path='/' component={Welcome} />
                <Route path='/signup' component={SignUp} />
                <Route path='/signin' component={SignIn} />
                <Route path='/foyer' component={Navbar} />
                <Route path='/logout' component={LogOut} />
                <Route path='/foyer' component={Foyer} />
            </Router>
        </div>
    )
}

export default App