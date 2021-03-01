import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";

import Navbar from './components/navbar.component';
import SignUp from './components/signup.component';
import SignIn from './components/signin.component';

function App() {
    return ( 
        <div className='container'>
        <Router>
            <Navbar />
            <br />
            <Route path='/signup' component={SignUp} />
            <Route path='/signin' component={SignIn} />
        </Router>
        </div>
    )
}

export default App