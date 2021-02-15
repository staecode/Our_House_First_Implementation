import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class SignUp extends Component {

    constructor(props) {
        super(props);

        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeHandle = this.onChangeHandle.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            name: '',
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
            name: this.state.name,
            handle: this.state.handle,
            password: this.state.password
        }

        console.log(user);
        
        window.location = '/';
    }

    render() {
        return (
            <div>
                <h2>Sign Up!</h2>
                <h3>Create New User</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group"> 
                    <label>Name: </label>
                    <input type='text'
                        required
                        className='form-control'
                        value={this.state.name}
                        onChange={this.onChangeName}
                    />
                    </div>
                    <div className="form-group"> 
                    <label>Handle: </label>
                    <input type='text'
                        required
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
                        <input type='submit' value='CreateUser' className='btn btn-primary' />
                    </div>
                </form>
            </div>
        )
    }
}