<<<<<<< HEAD
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
=======
export default function Header() {
  return (
    <div>
      <h1>Header</h1>
>>>>>>> 55889f964c4feb9c50d7ad717aea2ec8aebd9bf2
    </div>
  )
}
