import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
} from 'react-router-dom'

import Graph from './components/Graph.js';
import Map from './components/Map.js';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-theme.css'
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';

//const client = new ApolloClient({
//  uri: 'http://localhost:4000/graphql',
//});

//const usersListQuery = gql`
//   query UsersListQuery {
//     users {
//       id
//       email
//     }
//   }
// `;
//
//const UsersList = ({ data: {loading, error, users }}) => {
//  if (loading) {
//    return <p>Loading ...</p>;
//  }
//  if (error) {
//    return <p>{error.message}</p>;
//  }
//  return (
//    <div className="parent">
//      <AddUser />
//      <ul>
//        { users.map( user => <li key={user.id}>{user.email}</li> ) }
//      </ul>
//    </div>
//  );
//};

//const UsersListWithData = graphql(usersListQuery)(UsersList)

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route path="/login" component={Login}/>
          <PrivateRoute path="/" component={Graph}/>
          <Route path="/register" component={Register}/>
        </div>
      </Router>
      //<ApolloProvider client={client}>
      //  <div className="App">
      //    <UsersListWithData />
      //  </div>
      //</ApolloProvider>

      // <Graph />
      // <Login />
    );
  }
}

const auth = {
	isAuthenticated: false,
	authenticate(cb) {
    // req.user on backend will contain user info if
		// this person has credentials that are valid
		fetch('/user', {
      credentials: 'include'
		})
		.then((res) => {
			this.isAuthenticated = true
			if (typeof cb === 'function') {
				cb(res.json().user);
			}
		})
		.catch((err) => {
			console.log('Error fetching authorized user.');
		});
	},
	signout(cb) {
		fetch('/logout', {
			method: 'POST',
			credentials: 'include'
		})
		.then((res) => {
			this.isAuthenticated = false; 
			if (typeof cb === 'function') {
				// user was logged out
				cb(true);
			}
		})
		.catch((err) => {
			console.log('Error logging out user.');
			if (typeof cb === 'function') {
				// user was not logged out
				cb(false);
			}
		});
	}
}

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    auth.isAuthenticated === true
      ? <Component {...props} />
      : <Redirect to='/login' />
  )} />
)

class Login extends Component {
  state = {
    redirectToReferrer: false,
    incorrectLogin: false,
	}

	login = (data) => {
		console.log('Logging in ' + data.email);
		fetch('http://localhost:4000/login', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json'
			},
		})
		.then((response) => {
      if (response.status === 200) {
				auth.authenticate(() => {
					this.setState({ redirectToReferrer: true })
				});
			} else {
        this.setState({ incorrectLogin: true })
      }
		})
		.catch((err) => {
			console.log('Error logging in.', err);
		});
	}

	render() {
		const { from } = this.props.location.state || { from: { pathname: '/' } }
		const { redirectToReferrer } = this.state
		
		if (redirectToReferrer) {
			return (
				<Redirect to={from}/>
			)
		}
		
		return (
			<div>
				<LoginForm onLogin={this.login} incorrectLogin={this.state.incorrectLogin} />
			</div>
		)
	}
}

class Register extends React.Component {
	state = {
		redirectToReferrer: false
	}

	register = (data) => {
		fetch('http://localhost:4000/register', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json'
			},
		})
		.then((response) => {
			if (response.status === 200) {
				auth.authenticate(() => {
					this.setState({ redirectToReferrer: true })
				});
			}
		})
		.catch((err) => {
			console.log('Error registering user.', err);
		});
	}

	render() {
		return (
			<div>
				<RegisterForm onRegister={this.register} />
			</div>
		)
	}
}

export default App;
