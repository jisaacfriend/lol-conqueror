import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer>
      <div className="donate">
        <a href="https://ko-fi.com/jisaacfriend">
          <FontAwesomeIcon icon={faHeart} /> Donate
        </a></div>
      <div className="github">
        <a href="https://github.com/jisaacfriend">
          <FontAwesomeIcon icon={faGithub} /> jisaacfriend
        </a></div>
      <div className="version">
        <span className="version-number">v0.0.1</span>
      </div>
    </footer>
  );
};

export default Footer;