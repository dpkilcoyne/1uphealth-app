import React, {Component} from 'react';
import axios from 'axios';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {appUserId: ''};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event) { this.setState({appUserId: event.target.value}); }
  handleSubmit(event) {
    axios.post('/login', { appUserId: this.state.appUserId })
      .then(response => {
        window.location.assign(response.data.connectUrl);
      })
      .catch(error => {
        console.log('Error: ' + error);
      })
    event.preventDefault();
    this.setState( {appUserId: ''});
  }
  render() {
    return (
        <main className="Flex-content">
          <header>
            <h1> 1upHealth $everything Demo App </h1>
            <h2> Login </h2>
          </header>
          <form onSubmit={this.handleSubmit}>
            <label> Username:
              <input type="text" appUserId={this.state.appUserId} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Submit" />
          </form>
        </main>
    );
  }
}
