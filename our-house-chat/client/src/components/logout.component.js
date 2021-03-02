import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class LoutOut extends Component {
    componentDidMount() {
        setTimeout(() => {this.logUserOut()}, 5000);
    }
    
    logUserOut() {
        localStorage.clear();
        this.props.history.push('/');
    }

    render() {
        return (
            <div className='text-danger'><h1>You are being logged out of Our House</h1></div>
        )
    }
}