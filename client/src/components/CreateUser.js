import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class CreateUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {id: '', email: '', password: ''};

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.mutate({
            variables: {
                email: this.state.email,
                password: this.state.password,
            }
        })
        .then( res => {
            console.log('should have changed this shit');
        });
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    ID:
                    <input type="text" name="id" value={this.state.id} onChange={this.handleChange} />
                </label>
                <label>
                    Email:
                    <input type="text" name="email" value={this.state.email} onChange={this.handleChange} />
                </label>
                <label>
                    Password:
                    <input type="text" name="password" value={this.state.password} onChange={this.handleChange} />
                </label>
                <input type="submit" value="Submit" />
            </form>
        );
    }
}

const createUserMutation = gql`
    mutation createUser($email: String!, $password: String!) {
        createUser(email: $email, password: $password) {
            id
            email
        }
    }
`;

const CreateUserWithMutation = graphql(createUserMutation)(CreateUser);

export default CreateUserWithMutation;