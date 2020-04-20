import React, {Component} from 'react';
import ReactNestedTable from './ReactNestedTable'
import axios from 'axios';

export default class Resources extends Component {
  render() {
    return ([
        <main className="Flex-content">
          <header>
            <h1> 1upHealth $everything Demo App </h1>
            <h2> Resources </h2>
          </header>
          <div>
            <RequestButton label="Import 1upHealth Data"/>
          </div>
        </main>
    ]);
  }
}

/**
 * Used to request 1upHealth and update MongoDB
 * @todo Request needs to use session cookie, currently no authentication
 * @todo Prevent overloading requests using state
 * @todo handle state of the button and loader
 *
 */
class RequestButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      resources: []
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState( {isLoading: true} );

    axios.get('/resources')
    .then((response) => {
      this.setState({
        resources: response.data.resources
      })
    })
    .catch(error => {
      console.log('Error: ' + error)
    })
  }
  render () {
    return (
      <div>
        <button
          className="btn btn-default"
          onClick={this.handleClick}>{this.props.label}
        </button>
        <ul className="resource-types">
          {this.state.resources.map(resource =>
            <ResourceLink resource={resource} />)
          }
        </ul>
      </div>
    );
  }
}

/**
 * When resource link is clicked, retrieve table from MongoDB
 * @todo use ReactNestedTable
 */
class ResourceLink extends Component {
  constructor(props) {
    super(props);
    this.state = {
      display: 'hidden',
      resourceData: null
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    if (this.state.display === 'hidden') {
      axios.get(`/resources/${this.props.resource}`)
      .then((response) => {
        this.setState({display: 'active'});
        this.setState({resourceData: response.data.resourceData});
      })
      .catch(error => {
        console.log('Error: ' + error)
      })
    }
    else {
      this.setState({display: 'hidden'});
    }
  }
  render() {
    return (
      <li>
        <button
          className="btn-text"
          onClick={this.handleClick}>
          {this.props.resource}
        </button>
        <div className={`resource-table-${this.state.display}`}>
          {JSON.stringify(this.state.resourceData)}
        </div>
      </li>
    );
  }
}
