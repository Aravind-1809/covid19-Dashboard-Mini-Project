/* eslint-disable prettier/prettier */
/* eslint-disable import/no-mutable-exports */
/* eslint-disable camelcase */
import {Component} from 'react'
import './index.css'

class HomeStatsList extends Component {
  render() {
    const {details} = this.props
    const {name, confirmed, active, recovered, deceased, population} = details

    return (
      <li className="table-head-container">
        <div className="count-containers1">
          <p className="state-name">{name}</p>
        </div>
        <div className="count-containers">
          <p className="count1">{confirmed}</p>
        </div>
        <div className="count-containers">
          <p className="count2">{active}</p>
        </div>
        <div className="count-containers">
          <p className="count3">{recovered}</p>
        </div>
        <div className="count-containers">
          <p className="count4">{deceased}</p>
        </div>
        <div className="count-containers">
          <p className="count5">{population}</p>
        </div>
      </li>
    )
  }
}

export default HomeStatsList
