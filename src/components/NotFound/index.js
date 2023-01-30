import {Link} from 'react-router-dom'
import './index.css'

const NotFound = () => (
  <div className="not-container">
    <img
      src="https://res.cloudinary.com/dlewtcmlt/image/upload/v1673594093/Group_7484_wbcdne.png"
      alt="not-found-pic"
      className="not-found-img"
    />
    <h1 className="not-found-head">PAGE NOT FOUND</h1>
    <p className="not-found-para">
      we are sorry, the page you requested could not be found <br /> Please go
      back to the homepage
    </p>
    <Link to="/">
      <button type="button" className="home-button">
        Home
      </button>
    </Link>
  </div>
)

export default NotFound
