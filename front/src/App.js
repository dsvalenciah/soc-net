import React, { Component } from 'react';
import _ from 'lodash';
import './App.css';
import request from 'superagent';
import { Button, Modal, ModalHeader, ModalBody, Alert, Table,
  Navbar, NavbarBrand, Nav, NavItem, NavLink
  } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';


class SignUpModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      passwordA: '',
      passwordB: '',
      name: '',

      message: '',

      alertVisible: false
    };
  }

  handleInvalidSubmit(event) { console.log(this.state); }

  saveUser(event) {
    console.log("..........");
    request('POST', 'http://0.0.0.0:8000/user/None')
      .send(this.state)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .then(res => {
        this.setState(
          {email: '', passwordA: '', passwordB: '', name: ''}
        );
      }, err => {
        console.log(err);
      });
  }

  findEmailInDatabase(email) {
    if (email !== '') {
      request('GET', `http://0.0.0.0:8000/user/${this.state.email}`)
        .send(this.state)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .then(res => {
          if (res.body.data.email === email) {
            this.setState(
              { alertVisible: true, message: this.state.email, email: '' }
            );
          }
        }, err => {
          console.log(err);
        });
    }
  }

  onDismiss() {
    this.setState({ alertVisible: false, message: '', email: '' });
  }

  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        toggle={this.props.toggle}
      >
        <ModalHeader toggle={this.props.toggle}>Sign-up</ModalHeader>
        <ModalBody>
          <AvForm
            onValidSubmit={this.saveUser.bind(this)}
            onInvalidSubmit={this.handleInvalidSubmit.bind(this)}
          >

          <Alert
            color="danger"
            isOpen={this.state.alertVisible}
            toggle={this.onDismiss.bind(this)}
          >
            {this.state.message} already exist in the database
          </Alert>

            <AvField
              name="email"
              type="email"
              value={this.state.email}
              onBlur={e => this.findEmailInDatabase(e.target.value)}
              onClick={this.onDismiss.bind(this)}
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
              name="passwordA"
              type="password"
              value={this.state.passwordA}
              onChange={e => this.setState({passwordA: e.target.value})}
              placeholder="password"
              validate={
                {pattern:
                  {value:
                    /^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})$/
                  }
                }
              }
              errorMessage="The password must have uppercase,
                lowercase, special characters and numbers"
              required
            />

            <AvField
              name="passwordB"
              type="password"
              value={this.state.passwordB}
              onChange={e => this.setState({passwordB: e.target.value})}
              placeholder="password again"
              validate={
                {
                  match:{value:'passwordA'},
                  pattern:
                    {value: 
                      /^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})$/
                    }
                  }
              }
              errorMessage="Password must match"
              required
            />

            <Button color="success">Go!</Button>
          </AvForm>
        </ModalBody>
      </Modal>
    )
  }
}


class SignInModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
  }

  handleInvalidSubmit(event) {
    console.log(this.state);
  }

  getUser(event) {
    request('GET', 'http://0.0.0.0:8000/user/None')
      .send(this.state)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .then(res => {
        this.setState(
          {email: '', password: '', visible: true}
        );
      }, err => {
        console.log(err);
      });
  }

  emailStateChange(event) {
    this.setState({email: event.target.value});
    console.log(event);
  }

  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        toggle={this.props.toggle}
      >
        <ModalHeader toggle={this.props.toggle}>Sign-up</ModalHeader>

        <ModalBody>
          <AvForm
            onValidSubmit={this.getUser.bind(this)}
            onInvalidSubmit={this.handleInvalidSubmit.bind(this)}
          >

            <AvField
              name="email"
              type="email"
              value={this.state.email}
              onChange={e => this.emailStateChange(e)}
              placeholder="email"
              required
            />

            <AvField
              name="password"
              type="password"
              value={this.state.password}
              onChange={e => this.setState({password: e.target.value})}
              placeholder="password"
              validate={{pattern:{value:
                /^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})$/}}}
              errorMessage="The password must have uppercase,
                lowercase, special characters and numbers"
              required
            />

            <Button color="success" >Go!</Button>

          </AvForm>
        </ModalBody>

      </Modal>
    )
  }

}


class UserListModal extends Component {
  constructor(props) {
    super(props);
    this.fetchUsers();
    this.state = {
      users: [],
      selected_user: '',
      modal: false
    };
  }

  toggle() {
    this.setState(
      {modal: !this.state.modal}
    );
  }

  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        toggle={this.props.toggle}
      >
        <ModalHeader toggle={this.props.toggle}>Sign-up</ModalHeader>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle.bind(this)} className={this.props.className}
        >
          <ModalHeader toggle={this.toggle.bind(this)}>User selected</ModalHeader>
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
        <ModalBody>
          <Table bordered striped responsive inverse size="sm">
            <thead>
              <tr>
                <th>#</th>
                <th><center>email</center></th>
              </tr>
            </thead>
            <tbody>
              {
                _.map(this.state.users, user => (
                  <tr  key={user.id} onClick={() => this.getUser(user)}>
                    <th scope="row">{
                      _.findIndex(this.state.users, {id: user.id}) + 1
                    }</th>
                    <td>{ user.email }</td>
                  </tr>
                )) 
              }
            </tbody>
          </Table>
        </ModalBody>

      </Modal>
    )
  }

  fetchUsers() {
    request('GET', 'http://0.0.0.0:8000/user/None')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .then(res => {
        this.setState({users: res.body.data});
      }, err => {
        console.log(err);
      });
  }

  getUser(user) {
    request('GET', `http://localhost:8000/user/${user.email}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .then(res => {
        this.setState({selected_user: res.body.data, modal: true});
      }, err => {
        console.log(err);
      });
  }

}


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signIn: false,
      signUp: false,
      userList: false
    };
  }

  toggleSignIn() { this.setState({ signIn: !this.state.signIn }); }
  toggleSignUp() { this.setState({ signUp: !this.state.signUp }); }
  toggleUserList() { this.setState({ userList: !this.state.userList }); }

  render() {
    return (
      <div className="App">

        <SignUpModal
          isOpen={this.state.signUp}
          toggle={this.toggleSignUp.bind(this)}
        />

        <SignInModal
          isOpen={this.state.signIn}
          toggle={this.toggleSignIn.bind(this)}
        />

        <UserListModal
          isOpen={this.state.userList}
          toggle={this.toggleUserList.bind(this)}
        />

        <Navbar color="faded" light toggleable>
          <NavbarBrand href="/">SocNet</NavbarBrand>
          <Nav className="ml-auto" navbar>
            <NavItem onClick={this.toggleUserList.bind(this)}>
              <NavLink>User list</NavLink>
            </NavItem>
            <NavItem onClick={this.toggleSignIn.bind(this)}>
              <NavLink>Sign in</NavLink>
            </NavItem>
            <NavItem onClick={this.toggleSignUp.bind(this)}>
              <NavLink>Sign up</NavLink>
            </NavItem>
          </Nav>
        </Navbar>

      </div>
    );
  }

}

export default App;