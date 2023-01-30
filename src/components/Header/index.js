import {Link} from 'react-router-dom'
import './index.css'

export default function Header() {
  return (
    <div className="header-container">
      <div className="logo-container">
        <Link className="nav-style" to="/">
          <p className="logo-text">
            COVID19<span className="logo-span">INDIA</span>
          </p>
        </Link>
      </div>
      <ul className="link-container">
        <Link className="nav-style" to="/">
          <li className="link">Home</li>
        </Link>
        <Link className="nav-style" to="/about">
          <li className="link">About</li>
        </Link>
      </ul>
    </div>
  )
}
