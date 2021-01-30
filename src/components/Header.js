import React from 'react';
import logo from '../images/logo.png';

class Header extends React.Component {
  render() {
    return (
      <header>
        <img className="header-logo" alt="logo" src={logo} />
      </header>
    );
  }
}

export default Header;
