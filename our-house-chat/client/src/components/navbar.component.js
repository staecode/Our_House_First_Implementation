import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {
    render() {
        return (
            <nav className='navbar navbar-dark bg-dark navbar-expand-lg'>                
                <Link to='/logout' className='navbar-brand'>Log Out</Link>
            </nav>
        )
    }
}