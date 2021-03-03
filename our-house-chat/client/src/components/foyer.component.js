import axios from 'axios';
import React, { Component } from 'react';
import jwt_decode from 'jwt-decode';


export default class SignIn extends Component {
    
    constructor(props) {
        super(props);
        
        this.state = {
            userId: '',
            handle: '',
            signin: true,
            token: null
        }

    }

    componentDidMount() {
        let token = JSON.parse(localStorage.getItem('token')).token;
        if(token) {
            this.setState({ 
                signin: true,
                token: token
            })
            let decoded = jwt_decode(token);
            this.setState({userId: decoded.userId, handle: decoded.handle});
        } else {
            this.setState({signin: false})
        }
    }

    logUserOut() {
        this.setState({token: null});
        this.props.history.push('/logout');
    }
    
    render() {
        return (
            <div>
                {
                    !this.state.signin?
                    this.logUserOut()
                :
                    <div>
                        <br />
                        <h2>Foyer for {this.state.handle}</h2>
                    </div>
                }
            </div>
        )
    }
}