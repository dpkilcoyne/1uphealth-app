import React, { Component } from 'react';
import { Link } from "react-router-dom";


export default class Home extends Component {
  render() {
    return ([
      <main className="Flex-content">
        <header>
          <h1> 1upHealth $everything Demo App </h1>
          <h2> Home </h2>
        </header>
        <ol>
          <li>
            <Link to="/login">Login</Link> and enter your username (currently passwordless).
          </li>
          <li>
            Follow the link to the 1upEverything portal and enter the demo credentials:<br/>
            username: fhirjason<br/>
            password: epicepic1
          </li>
          <li>
            Go to <Link to="/resources">Resources</Link> and retrieve your 1upHealth data. Click on the resource to view.
          </li>
        </ol>
      </main>
    ]);
  }
}
