import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class SignIn extends Component {

    constructor(props) {
        super(props);

        this.onChangeHandle = this.onChangeHandle.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    

        this.state = {
            handle: '',
            password: '',
            errorMessage: '',
            signin: false
        }
    }

  

    onChangeHandle(e) {
        this.setState({
            handle: e.target.value
        });
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value
        });
    }

    onSubmit(e) {
        
        e.preventDefault();

        const user = {
            handle: this.state.handle,
            password: this.state.password
        }

        
        fetch('http://localhost:3000/users/signin', {
            method: "POST",
            body: JSON.stringify(user),
            headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
               }
        }).then(res => {
            res.json().then(result => {
                console.log(result);
                localStorage.setItem('token', JSON.stringify({
                    token: result.token
                }));
            })
        })

        if(localStorage.getItem('token') != null) {
            console.log('Token set');
            this.props.history.push('/foyer');
        } else {
            this.setState({errorMessage: "Authorization failed."})
        }
    }

  

    render() {
        return (
            <div>
                <h2>Welcome to Our House</h2>
                <h3>Sign In</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group"> 
                    <label>Handle: </label>
                    <input type='text'
                        required
                        placeholder='Enter Handle'
                        className='form-control'
                        value={this.state.handle}
                        onChange={this.onChangeHandle}
                    />
                    </div>
                    <div className="form-group"> 
                    <label>Password: </label>
                    <input type='password'
                        name='password'
                        required
                        className='form-control'
                        value={this.state.password}
                        onChange={this.onChangePassword}
                    />
                    </div>
                    <div><h3 className="text-danger">{this.state.errorMessage}</h3></div>
                    <div className='form-group'>
                        <input type='submit' value='Sign In' className='btn btn-primary' />
                    </div>
                </form>
                <a href='/signup'>No account? No problem, sign up today!</a>
            </div>
        )
    }
}