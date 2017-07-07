import React, { Component } from 'react';
import _ from 'lodash';
import './App.css';
import request from 'superagent';
import { Button, Modal, ModalHeader, ModalBody, Alert, Table, ButtonDropdown,
         DropdownToggle, DropdownMenu, DropdownItem, Navbar, NavbarBrand, Nav,
         NavItem, NavLink } from 'reactstrap';
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

  createUser(event) {
    request('POST', 'http://0.0.0.0:8000/create_user')
      .send(
        {
          'email': this.state.email,
          'password': this.state.passwordA,
          'name': this.state.name
        }
      )
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .then(res => {
        this.props.toggle();
        this.setState(
          { email: '', passwordA: '', passwordB: '', name: '' }
        );
        this.props.activeUser(
          { 'email': res.body.data.email, 'name': res.body.data.name }
        );
      }, err => {
        console.log(err);
      });
  }

  getUserByEmail(email) {
    if (email !== '') {
      request('GET', `http://0.0.0.0:8000/get_user/${this.state.email}`)
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
            onValidSubmit={this.createUser.bind(this)}
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
              onBlur={e => this.getUserByEmail(e.target.value)}
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
                  {value: /^[a-zA-Z ]{3,40}$/}
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
      password: '',

      alertVisible: false
    };
  }

  handleInvalidSubmit(event) {
    console.log(this.state);
  }

  getUserByEmailPassword(event) {
    request('POST', 'http://0.0.0.0:8000/get_user')
      .send(this.state)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .then(res => {
        if (res.body.data.message === 'The email or password is not in database') {
          this.props.activeUser(null);
          this.setState(
            { email: '', password: '', alertVisible: true }
          );
        } else {
          this.props.activeUser(
            { 'email': res.body.data.email, 'name': res.body.data.name }
          );
          this.props.toggle();
          this.setState(
            { email: '', password: '' }
          );
        }
      }, err => {
        console.log(err);
      });
  }

  emailStateChange(event) {
    this.setState({email: event.target.value});
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
            onValidSubmit={this.getUserByEmailPassword.bind(this)}
            onInvalidSubmit={this.handleInvalidSubmit.bind(this)}
          >

            <Alert
              color="danger"
              isOpen={this.state.alertVisible}
              toggle={this.onDismiss.bind(this)}
            >
              ¡the specified user is not exist in the database!
            </Alert>

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
    this.state = {
      users: [],
      selected_user: '',
      modal: false
    };
    this.getAllUsers();
  }

  toggle() {
    this.setState(
      { modal: !this.state.modal }
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
                  <tr  key={user.id} onClick={() => this.getUserByEmail(user.email)}>
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

  getAllUsers() {
    request('GET', 'http://0.0.0.0:8000/get_user')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .then(res => {
        this.setState({ users: res.body.data });
      }, err => {
        console.log(err);
      });
  }

  getUserByEmail(email) {
    if (email !== '') {
      request('GET', `http://0.0.0.0:8000/get_user/${email}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .then(res => {
          this.setState(
            { modal: true, selected_user: res.body.data }
          );
        }, err => {
          console.log(err);
        });
    }
  }

}

/*
class UserProfileModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false
    };
  }



  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        toggle={this.props.toggle}
      >
        <ModalHeader toggle={this.props.toggle}>Sign-up</ModalHeader>
        <ModalBody>
          HELLO WORLD
        </ModalBody>

      </Modal>
    )
  }

}
*/

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signInOpen: false,
      signUpOpen: false,
      userListOpen: false,

      activeUser: null,
      userDropdownOpen: false
    };
  }

  toggleSignIn() { this.setState({ signInOpen: !this.state.signInOpen }); }
  toggleSignUp() { this.setState({ signUpOpen: !this.state.signUpOpen }); }
  toggleUserList() { this.setState({ userListOpen: !this.state.userListOpen }); }
  toggleUserOptions() { 
    this.setState({ userDropdownOpen: !this.state.userDropdownOpen });
  }

  setActiveUser(user) { this.setState({activeUser: user}); }

  render() {
    return (
      <div className="App">

        <SignUpModal
          isOpen={this.state.signUpOpen}
          toggle={this.toggleSignUp.bind(this)}
          activeUser={this.setActiveUser.bind(this)}
        />

        <SignInModal
          isOpen={this.state.signInOpen}
          toggle={this.toggleSignIn.bind(this)}
          activeUser={this.setActiveUser.bind(this)}
        />

        <UserListModal
          isOpen={this.state.userListOpen}
          toggle={this.toggleUserList.bind(this)}
        />

        <Navbar color="faded" light toggleable>
          <NavbarBrand href="/">SocNet</NavbarBrand>
          {
            this.state.activeUser?
              <Nav className="ml-auto" navbar>
                <ButtonDropdown
                  isOpen={this.state.userDropdownOpen}
                  toggle={this.toggleUserOptions.bind(this)}
                >
                  <Button id="caret">
                  { this.state.activeUser.name }
                  </Button>
                  <DropdownToggle caret size="sm">
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem header>User Options</DropdownItem>
                    <DropdownItem>Searches</DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem>Configuration</DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem>Exit</DropdownItem>
                  </DropdownMenu>
                </ButtonDropdown>
              </Nav>
            :
              <Nav className="ml-auto" navbar>
                <NavItem onClick={this.toggleUserList.bind(this)}>
                  <NavLink active>User list</NavLink>
                </NavItem>
                <NavItem onClick={this.toggleSignIn.bind(this)}>
                  <NavLink active>Sign in</NavLink>
                </NavItem>
                <NavItem onClick={this.toggleSignUp.bind(this)}>
                  <NavLink active>Sign up</NavLink>
                </NavItem>
              </Nav>
          }
        </Navbar>

      </div>
    );
  }

}

export default App;