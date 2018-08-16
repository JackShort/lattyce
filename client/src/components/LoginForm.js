import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import {
	Link
} from 'react-router-dom';
import "./Login.css";

class LoginForm extends Component {
	constructor(props) {
		super(props);
	
		this.state = {
			username: "",
			password: ""
		};
	}
	
	validateForm() {
		return this.state.username.length > 0 && this.state.password.length > 0;
	}
	
	handleChange = event => {
		this.setState({
			[event.target.id]: event.target.value
		});
	}
	
	handleSubmit = event => {
		event.preventDefault();
		return this.props.onLogin({
			email: this.state.username,
			password: this.state.password
		});
	}
	
	render() {
		return (
			<div className="Login">
				<div className="alert alert-warning" hidden={!this.props.incorrectLogin}>
   	 				Incorrect login information.
  				</div>

				<form onSubmit={this.handleSubmit}>
					<FormGroup controlId="username" bsSize="large">
						<ControlLabel>Username</ControlLabel>
						<FormControl
							autoFocus
							type="text"
							value={this.state.username}
							onChange={this.handleChange}
						/>
					</FormGroup>
					<FormGroup controlId="password" bsSize="large">
						<ControlLabel>Password</ControlLabel>
						<FormControl
							value={this.state.password}
							onChange={this.handleChange}
							type="password"
						/>
					</FormGroup>
					<Button
						block
						bsSize="large"
						disabled={!this.validateForm()}
						type="submit"
					>
					Login
					</Button>

                    <hr />

					<Link to="/Register">Click to register</Link>
				</form>
			</div>
		);
	}
}

export default LoginForm;