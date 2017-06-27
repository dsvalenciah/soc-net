import React, { Component } from 'react';
import './App.css';
import request from 'superagent';
import _ from 'lodash';
import { Button, Table, Modal, ModalHeader, ModalBody, Alert } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';


class UserInput extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password_1: '',
      password_2: '',
      name: '',
      visible: false
    };
  }

  onDismiss() {
    this.setState({ visible: false });
  }

  handleInvalidSubmit(event) {
    console.log(this.state);
  }

  saveUser(event) {
    request('POST', 'http://0.0.0.0:8000/user/None')
      .send(this.state)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .then(res => {
        this.props.onCreated();
        this.setState(
          {email: '', password_1: '', password_2: '', name: '', visible: true}
        );
      }, err => {
        console.log(err);
      });
  }

  render() {
    return (
      <AvForm
        onValidSubmit={this.saveUser.bind(this)}
        onInvalidSubmit={this.handleInvalidSubmit.bind(this)}
      >
        <Alert color="info"
          isOpen={this.state.visible}
          toggle={this.onDismiss.bind(this)}
        >
          ¡the user has ben created!
        </Alert>

        <AvField
          name="email"
          type="email"
          value={this.state.email}
          onChange={e => this.setState({email: e.target.value})}
          placeholder="email"
          required
        />

        <AvField
          name="name"
          type="text"
          value={this.state.name}
          onChange={e => this.setState({name: e.target.value})}
          placeholder="name"
          validate={
            {pattern:
              {value: /^[a-zA-Z ]{6,20}$/}
            }
          }
          required
        />

        <AvField
          name="password_1"
          type="password"
          value={this.state.password_1}
          onChange={e => this.setState({password_1: e.target.value})}
          placeholder="password"
          validate={
            {pattern:
              {value: /^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})$/}
            }
          }
          errorMessage="The password must have uppercase, lowercase, special characters and numbers"
          required
        />

        <AvField
          name="password_2"
          type="password"
          value={this.state.password_2}
          onChange={e => this.setState({password_2: e.target.value})}
          placeholder="password again"
          validate={
            {
              match:{value:'password_1'},
              pattern:
                {value: /^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})$/}
              }
          }
          errorMessage="Password must match"
          required
        />

        <Button
          color="success"
        >Create User</Button>{' '}
      </AvForm>
    )
  }

}

class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      selected_user: ''
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }
  render() {
    return (
      <div>

        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle} className={this.props.className}
        >
          <ModalHeader toggle={this.toggle}>User selected</ModalHeader>
          <ModalBody>
            <Table bordered striped responsive inverse size="sm">
              <thead>
                <tr>
                  <th><center>id</center></th>
                  <th><center>email</center></th>
                  <th><center>password</center></th>
                  <th><center>name</center></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{ this.state.selected_user.id }</td>
                  <td>{ this.state.selected_user.email }</td>
                  <td>{ this.state.selected_user.password }</td>
                  <td>{ this.state.selected_user.name }</td>
                </tr>
              </tbody>
            </Table>
          </ModalBody>
        </Modal>

        <Table bordered striped responsive inverse size="sm">
          <thead>
            <tr>
              <th>#</th>
              <th><center>email</center></th>
            </tr>
          </thead>
          <tbody>
            {
              _.map(this.props.users, user => (
                <tr  key={user.id} onClick={() => this.completeTask(user)}>
                  <th scope="row">{
                    _.findIndex(this.props.users, {id: user.id}) + 1
                  }</th>
                  <td>{ user.email }</td>
                </tr>
              )) 
            }
          </tbody>
        </Table>
      </div>
    )
  }
  completeTask(user) {
    request('GET', `http://localhost:8000/user/${user.id}`)
      .send({done: !user.done})
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .then(res => {
        this.toggle();
        this.setState({selected_user: res.body.data});
      }, err => {
        console.log(err);
      });
  }

}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      users: []
    }
  }

  render() {
    return (
      <div className="App">
        <UserInput
          onCreated={() => this.fetchUsers()}
        />
        <UserList
          users={this.state.users}
          onUpdate={() => this.fetchUsers()}
        />
      </div>
    );
  }

  fetchUsers() {
    request('GET', 'http://0.0.0.0:8000/user/None')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .then(res => {
        console.log(res);
        this.setState({users: res.body.data});
      }, err => {
        console.log(err);
      });
  }

  componentDidMount() {
    this.fetchUsers();
  }
}

export default App;