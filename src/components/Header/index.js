import {Link} from 'react-router-dom'
import {AiOutlineMenu, AiFillCloseCircle} from 'react-icons/ai'
import './index.css'
import CovidContext from '../../Context/CovidContext'

const Header = () => (
  <CovidContext.Consumer>
    {value => {
      const {displayMobileView, showNavs, displayMenus} = value

      const onClose = () => {
        displayMobileView()
      }

      const onShowNavs = () => {
        displayMenus()
      }

      return (
        <>
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
            <button
              className="empty-button view"
              type="button"
              onClick={onShowNavs}
            >
              <AiOutlineMenu className="mobile-view" />
            </button>
          </div>
          {showNavs && (
            <div className="mobile-navs">
              <ul className="link-container1">
                <Link className="nav-style" to="/">
                  <li className="mobile-link">Home</li>
                </Link>
                <Link className="nav-style" to="/about">
                  <li className="mobile-link">About</li>
                </Link>
              </ul>
              <button className="empty-button" onClick={onClose} type="button">
                <AiFillCloseCircle className="close" />
              </button>
            </div>
          )}
        </>
      )
    }}
  </CovidContext.Consumer>
)

export default Header
