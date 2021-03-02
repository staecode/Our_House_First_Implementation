import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class ErrorBoundary extends Component {
    state = {errorMessage: ''}

    static getDerivedStateFromError(error) {
        return {errorMessage: error.toString()}
    }

    render() {
        if (this.state.error) {
            return <h1>{this.state.errorMessage}</h1>
        }
        return this.props.children;
    }
};