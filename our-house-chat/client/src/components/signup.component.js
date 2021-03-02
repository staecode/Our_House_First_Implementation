import React, { Component } from 'react';
import axios from 'axios';

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
            errorMessage: '',
            success: false
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
            password: this.state.password,
        }

        console.log(user);

        axios.post('http://localhost:5000/users/signup', user)
        .then(res => {
            console.log(res.data);
            this.setState({errorMessage: ''})
            this.setState({success: true});
        })
        .catch(err => {
            console.log(err)
            this.setState({errorMessage: 'Handle is in use by another user.'})
        });

        // window.location = '/signin';
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
                        placeholder='Create Handle'
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
                        <input type='submit' value='SignUp' className='btn btn-primary' />
                    </div>
                    {this.state.success &&
                    <div>
                        <h3 className='text-sucess'>{this.state.handle} created!</h3>
                        <a href='/signin'>Sign in to create chat rooms!</a>
                    </div>
                    }
                </form>
            </div>
        )
    }
}