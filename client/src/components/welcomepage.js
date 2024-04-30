import React, { Component } from 'react';
import LoginForm from './loginform';
import RegisterForm from './registerform';

class WelcomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoginForm: false,
      showRegisterForm: false,
    };
  }

  handleLoginClick = () => {
    this.setState({ showLoginForm: true, showRegisterForm: false });
  };

  handleRegisterClick = () => {
    this.setState({ showLoginForm: false, showRegisterForm: true });
  };
  handleQuestClick = () => {
    this.props.toggleQuestionPage();
  }

  render() {
    const { showLoginForm, showRegisterForm } = this.state;

    return (
      <div className="container">
        <div className="form-group">
          <h1 style={{ marginTop: '30px', fontSize: '30px', color: '#383838' }}>
            <i>Welcome, Guest!</i>
          </h1>
        </div>
        <div className="form-group" id="nav-buttons">
          <button
            className="welc-buttons"
            id="loginBtn"
            onClick={this.handleLoginClick}
          >
            Login
          </button>
          <button
            className="welc-buttons"
            id="registerBtn"
            onClick={this.handleRegisterClick}
          >
            Register
          </button>
          <button
            className="welc-buttons"
            id="loginBtn"
            onClick={this.handleQuestClick}
          >
            Continue As Guest
          </button>
        </div>
        {showLoginForm && <LoginForm toggleQuestionPage ={this.props.toggleQuestionPage} handleLogIn={this.props.handleLogIn}/>}
        {showRegisterForm && <RegisterForm handleLoginClick ={this.handleLoginClick}/>}
      </div>
    );
  }
}

export default WelcomePage;
