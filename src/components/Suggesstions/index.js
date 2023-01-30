/* eslint-disable camelcase */
import {BiChevronRightSquare} from 'react-icons/bi'
import {Link} from 'react-router-dom'
import './index.css'

const Suggestions = props => {
  const {suggestionDetails} = props
  const {state_code, state_name} = suggestionDetails

  return (
    <Link className="nav-style suggestion-list" to={`/state/${state_code}`}>
      <li className="suggestion-list">
        <p className="suggestion-name">{state_name}</p>

        <button className="suggestion-button" type="button">
          <div className="button-container">
            <p>{state_code}</p>
            <BiChevronRightSquare className="greater-icon" />
          </div>
        </button>
      </li>
    </Link>
  )
}

export default Suggestions
