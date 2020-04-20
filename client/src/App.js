import "./App.css"
import React, {Component} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Home from './components/Home';
import Login from './components/Login';
import Resources from './components/Resources';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      routes: [
        {name: 'Home', uri: '/'},
        {name: 'Login', uri: '/login'},
        {name: 'Resources', uri:'/resources'}
      ],
    };
  }
  render() {
    return (
      <Router>
          <nav className="nav-bar">
            <ul className="resource-types">
              {this.state.routes.map( ({name, uri}) =>
                <li><Link to={uri}>{name}</Link></li>
              )
            }
            </ul>
          </nav>
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/resources">
              <Resources />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
      </Router>
    );
  }
}
