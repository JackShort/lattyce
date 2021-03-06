
import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import {
    Link
} from 'react-router-dom';
import "./Register.css";

class RegisterForm extends Component {
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
		return this.props.onRegister({
			email: this.state.username,
			password: this.state.password
		});
	}
	
	render() {
		return (
			<div className="Register">
				<div className="alert alert-warning alert-dismissible"  role="alert" hidden={!this.props.incorrectRegistration}>
   	 				<strong>Registration failed!</strong> Username already taken.
  				</div>

				<div className="header">
					<h2>Lattyce</h2>
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
						className="btn btn-primary"
					>
					Register
					</Button>

                    <hr />

				    <Link to="/login">Click to login</Link>
				</form>
			</div>
		);
	}
}

export default RegisterForm;