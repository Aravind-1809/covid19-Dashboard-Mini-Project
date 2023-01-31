import {VscGithubAlt} from 'react-icons/vsc'
import {FaTwitter} from 'react-icons/fa'
import {FiInstagram} from 'react-icons/fi'
import './index.css'

const Footer = () => (
  <div className="footer-container">
    <p className="logo-text">
      COVID19<span className="logo-span">INDIA</span>
    </p>
    <p className="footer-description">
      we stand with everyone fighting on the front lines
    </p>
    <div className="socialmedia-icon-container">
      <VscGithubAlt className="icon" />
      <FiInstagram className="icon" />
      <FaTwitter className="icon" />
    </div>
  </div>
)

export default Footer
