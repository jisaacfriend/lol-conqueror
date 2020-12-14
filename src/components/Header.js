import logo from '../images/logo.png';

const Header = () => {
  return (
    <header>
      <img className="header-logo" alt="logo" src={logo} />
    </header>
  );
};

export default Header;