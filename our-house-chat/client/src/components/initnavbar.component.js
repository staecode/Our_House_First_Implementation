import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class InitNavbar extends Component {
    render() {
        return (
            <nav className='navbar navbar-dark bg-dark navbar-expand-lg'>                
                <Link to='/signin' className='navbar-brand'>Sign In</Link>
                <Link to='/signup' className='navbar-brand'>Sign Up</Link>
            </nav>
        )
    }
}