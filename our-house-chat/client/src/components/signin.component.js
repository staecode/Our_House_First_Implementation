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
        }
    }
    
    onChangeName(e) {
        this.setState({
            name: e.target.value
        });
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

        console.log(user);

        window.location = '/';
    }

    render() {
        return (
            <div>
                <h2>Welcome to Our House</h2>
                <h3>Sign In</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group"> 
                    <label>Name: </label>
                    <input type='text'
                        required
                        placeholder='Enter Name'
                        className='form-control'
                        value={this.state.name}
                        onChange={this.onChangeName}
                    />
                    </div>
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
                    <div className='form-group'>
                        <input type='submit' value='SignUp' className='btn btn-primary' />
                    </div>
                </form>
                <a href='/signup'>No account? No problem, sign up today!</a>
            </div>
        )
    }
}