/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unknown-property */
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import {FcGenericSortingAsc, FcGenericSortingDesc} from 'react-icons/fc'
import Header from '../Header'
import Footer from '../Footer'
import statesList from '../../fixtureData'
import './index.css'
import HomeStats from '../HomeStats'
import Suggestions from '../Suggesstions'

const apiStatus = {
  initial: 'INITIAL',
  inProgress: 'PROGRESS',
  failed: 'FAILED',
  success: 'SUCCESS',
}

class Home extends Component {
  state = {
    searchInput: '',
    apiData: [],
    suggestionList: [],
    searchView: false,
    status: apiStatus.initial,
    totalConfirm: 0,
    totalActive: 0,
    totalRecover: 0,
    totalDecease: 0,
  }

  componentDidMount() {
    this.getOverallCase()
  }

  getOverallCase = async () => {
    this.setState({status: apiStatus.inProgress})
    const url = 'https://apis.ccbp.in/covid19-state-wise-data'
    const response = await fetch(url)
    if (response.ok) {
      const data = await response.json()

      console.log(data)

      const convertObjectsDataIntoListItemsUsingForInMethod = () => {
        const resultList = []
        let countryConfirm = 0
        let countryRecover = 0
        let countryDeceased = 0
        let countryActive = 0
        const keyNames = Object.keys(data)

        keyNames
          .filter(keyName => keyName !== 'TT')
          .forEach(keyName => {
            if (data[keyName]) {
              const {total} = data[keyName]

              const confirmed = total.confirmed ? total.confirmed : 0
              const deceased = total.deceased ? total.deceased : 0
              const recovered = total.recovered ? total.recovered : 0
              const tested = total.tested ? total.tested : 0
              const population = data[keyName].meta.population
                ? data[keyName].meta.population
                : 0
              countryConfirm += confirmed
              countryRecover += recovered
              countryDeceased += deceased

              resultList.push({
                stateCode: keyName,
                name: statesList.find(state => state.state_code === keyName)
                  .state_name,
                confirmed,
                deceased,
                recovered,
                tested,
                population,
                active: confirmed - (deceased + recovered),
              })
            }
          })
        countryActive = countryConfirm - (countryDeceased + countryRecover)
        this.setState({
          totalActive: countryActive,
          totalConfirm: countryConfirm,
          totalDecease: countryDeceased,
          totalRecover: countryRecover,
        })
        countryConfirm = 0
        countryRecover = 0
        countryDeceased = 0
        countryActive = 0
        return resultList
      }

      const listFormattedDataUsingForInMethod = convertObjectsDataIntoListItemsUsingForInMethod()
      console.log(listFormattedDataUsingForInMethod)
      this.setState({
        apiData: listFormattedDataUsingForInMethod,
        status: apiStatus.success,
      })
    } else {
      this.setState({status: apiStatus.failed})
    }
  }

  loadingView = () => (
    <div className="loader-container" testid="homeRouteLoader">
      <Loader type="TailSpin" color="#007BFF" height="50" width="50" />
    </div>
  )

  renderStats = () => {
    const {apiData} = this.state
    return <HomeStats data={apiData} />
  }

  searchState = event => {
    this.setState(
      {searchInput: event.target.value, searchView: true},
      this.renderSearchView,
    )
  }

  onBlurSearch = () => {
    this.setState({searchView: false})
  }

  renderSearchView = () => {
    const {searchInput} = this.state

    const filtered = statesList.filter(each =>
      each.state_name.toLowerCase().includes(searchInput.toLowerCase()),
    )
    this.setState({suggestionList: filtered})
  }

  onSortAscending = () => {
    const {apiData} = this.state
    apiData.sort((a, b) => {
      if (a.name < b.name) {
        return -1
      }
      if (a.name > b.name) {
        return 1
      }
      return 0
    })
    this.setState({apiData})
  }

  onSortDescending = () => {
    const {apiData} = this.state
    apiData.sort((a, b) => {
      if (a.name > b.name) {
        return -1
      }
      if (a.name < b.name) {
        return 1
      }
      return 0
    })
    this.setState({apiData})
  }

  renderSuggestions = () => {
    const {suggestionList} = this.state

    return (
      <ul
        testid="searchResultsUnorderedList"
        className="search-result-container"
      >
        {suggestionList.map(each => (
          <Suggestions key={each.state_code} suggestionDetails={each} />
        ))}
      </ul>
    )
  }

  renderHomePage = () => {
    const {totalActive, totalConfirm, totalDecease, totalRecover} = this.state
    return (
      <>
        <div className="corona-container">
          <div
            testid="countryWideConfirmedCases"
            className="country-wide-containers"
          >
            <p className="confirm">Confirmed</p>
            <img
              src="https://res.cloudinary.com/dlewtcmlt/image/upload/v1672728823/Group_xk7lvp.png"
              alt="country wide confirmed cases pic"
              className="case-icon"
            />
            <p className="overall-count1">{totalConfirm}</p>
          </div>
          <div
            testid="countryWideActiveCases"
            className="country-wide-containers"
          >
            <p className="active">Active</p>
            <img
              src="https://res.cloudinary.com/dlewtcmlt/image/upload/v1672728823/protection_1_lkmhql.png"
              alt="country wide active cases pic"
              className="case-icon"
            />
            <p className="overall-count2">{totalActive}</p>
          </div>
          <div
            testid="countryWideRecoveredCases"
            className="country-wide-containers"
          >
            <p className="recover">Recovered</p>
            <img
              src="https://res.cloudinary.com/dlewtcmlt/image/upload/v1672728842/recovered_1_huy4pf.png"
              alt="country wide recovered cases pic"
              className="case-icon"
            />
            <p className="overall-count3">{totalRecover}</p>
          </div>
          <div
            testid="countryWideDeceasedCases"
            className="country-wide-containers"
          >
            <p className="decease">Deceased</p>
            <img
              src="https://res.cloudinary.com/dlewtcmlt/image/upload/v1672728823/Outline_hgn6eh.png"
              alt="country wide deceased cases pic"
              className="case-icon"
            />
            <p className="overall-count4">{totalDecease}</p>
          </div>
        </div>
        <div testid="stateWiseCovidDataTable" className="data-table">
          <ul className="data-table1">
            <div className="table-head-container">
              <div className="sort-container">
                <p className="table-heads">States/UT</p>
                <button
                  className="empty-button"
                  type="button"
                  testid="ascendingSort"
                  onClick={this.onSortAscending}
                >
                  <FcGenericSortingAsc className="sort-icon" />
                </button>
                <button
                  className="empty-button"
                  type="button"
                  testid="descendingSort"
                  onClick={this.onSortDescending}
                >
                  <FcGenericSortingDesc className="sort-icon" />
                </button>
              </div>
              <p className="table-heads">Confirmed</p>
              <p className="table-heads">Active</p>
              <p className="table-heads">Recovered</p>
              <p className="table-heads">Deceased</p>
              <p className="table-heads">Population</p>
            </div>
            <hr className="line" />
            {this.renderStats()}
          </ul>
        </div>
      </>
    )
  }

  renderViews = () => {
    const {status} = this.state
    switch (status) {
      case apiStatus.inProgress:
        return this.loadingView()
      case apiStatus.success:
        return this.renderHomePage()
      default:
        return null
    }
  }

  render() {
    const {searchInput, searchView, status} = this.state

    return (
      <div className="bg-container">
        <Header />
        {status === apiStatus.success ? (
          <>
            <div className="search-container">
              <BsSearch className="search-icon" />
              <input
                onChange={this.searchState}
                value={searchInput}
                type="search"
                placeholder="Enter the State"
                className="search-input"
              />
            </div>
            {searchView ? this.renderSuggestions() : this.renderHomePage()}
            {searchView ? null : <Footer />}
          </>
        ) : (
          this.renderViews()
        )}
      </div>
    )
  }
}

export default Home
