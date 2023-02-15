/* eslint-disable no-return-assign */
/* eslint-disable react/no-unknown-property */
/* eslint-disable prefer-destructuring */
/* eslint-disable prefer-arrow-callback */
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {XAxis, BarChart, Bar, LineChart, YAxis, Tooltip, Line} from 'recharts'
import Footer from '../Footer'
import Header from '../Header'
import statesList from '../../fixtureData'
import Districts from '../Districts'
import './index.css'

const apiStatus = {
  initial: 'INITIAL',
  inProgress: 'PROGRESS',
  failed: 'FAILED',
  success: 'SUCCESS',
}

class SpecificState extends Component {
  state = {
    specificData: [],
    isConfirmActive: true,
    isActiveActive: false,
    isRecoverActive: false,
    isDeceasedActive: false,
    timelineData: [],
    status: apiStatus.initial,
    orderedDistrictArray: [],
  }

  componentDidMount() {
    this.getSelectedStateData()
    this.getSpecificStateDetail()
  }

  getSelectedStateData = async () => {
    this.setState({status: apiStatus.inProgress})
    const {match} = this.props
    const {params} = match
    const {stateCode} = params
    const url = 'https://apis.ccbp.in/covid19-state-wise-data'
    const response = await fetch(url)
    if (response.ok) {
      const data = await response.json()

      const convertObjectsDataIntoListItemsUsingForInMethod = () => {
        const resultList = []

        const keyNames = Object.keys(data)

        keyNames.forEach(keyName => {
          if (data[keyName]) {
            if (keyName === stateCode) {
              const {total} = data[keyName]

              const confirmed = total.confirmed ? total.confirmed : 0
              const deceased = total.deceased ? total.deceased : 0
              const recovered = total.recovered ? total.recovered : 0
              const tested = total.tested ? total.tested : 0
              const population = data[keyName].meta.population
                ? data[keyName].meta.population
                : 0
              const lastUpdate = data[keyName].meta.last_updated
              const topDistricts = data[keyName].districts

              const districtListFunction = () => {
                const districtList = []
                const keys = Object.keys(topDistricts)
                keys.forEach(key => {
                  if (topDistricts[key]) {
                    const totalConfirm = topDistricts[key].total.confirmed
                      ? topDistricts[key].total.confirmed
                      : 0
                    const totalDeceased = topDistricts[key].total.deceased
                      ? topDistricts[key].total.deceased
                      : 0
                    const totalRecover = topDistricts[key].total.recovered
                      ? topDistricts[key].total.recovered
                      : 0
                    const totalTested = topDistricts[key].total.tested
                      ? topDistricts[key].total.tested
                      : 0

                    const totalActive =
                      totalConfirm - (totalDeceased + totalRecover)

                    districtList.push({
                      district: key,
                      totalConfirm,
                      totalDeceased,
                      totalRecover,
                      totalTested,
                      totalActive,
                    })
                  }
                })
                return districtList
              }

              const specificStateDistricts = districtListFunction()

              resultList.push({
                stateCode: keyName,
                name: statesList.find(state => state.state_code === keyName)
                  .state_name,
                confirmed,
                deceased,
                recovered,
                tested,
                population,
                lastUpdate,
                topDistricts: specificStateDistricts,
                active: confirmed - (deceased + recovered),
              })
            }
          }
        })
        return resultList
      }

      const particularData = convertObjectsDataIntoListItemsUsingForInMethod()
      const listOfDistricts = particularData.map(each => each.topDistricts)
      const districtArray = []
      listOfDistricts[0].forEach(each => {
        districtArray.push(each)
      })
      districtArray.sort((a, b) => b.totalConfirm - a.totalConfirm)
      console.log(districtArray)
      this.setState({
        specificData: particularData,
        status: apiStatus.success,
        orderedDistrictArray: districtArray,
      })
    } else {
      this.setState({status: apiStatus.failed})
    }
  }

  getSpecificStateDetail = async () => {
    this.setState({status: apiStatus.inProgress})
    const {match} = this.props
    const {params} = match
    const {stateCode} = params
    const requestUrl = `https://apis.ccbp.in/covid19-timelines-data/${stateCode}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(requestUrl, options)
    if (response.ok) {
      const data = await response.json()
      console.log(data)
      const convertObjectToArray = () => {
        const specificList = []
        const keyNames = Object.keys(data)
        keyNames.forEach(keyName => {
          if (data[keyName]) {
            const {dates} = data[keyName]
            const {districts} = data[keyName]

            const convertDate = () => {
              const dateWiseList = []
              const dateKeys = Object.keys(dates)

              dateKeys.forEach(dateKey => {
                if (dates[dateKey]) {
                  const dateWiseConfirm = dates[dateKey].total.confirmed
                    ? dates[dateKey].total.confirmed
                    : 0
                  const dateWiseRecover = dates[dateKey].total.recovered
                    ? dates[dateKey].total.recovered
                    : 0
                  const dateWiseDeceased = dates[dateKey].total.deceased
                    ? dates[dateKey].total.deceased
                    : 0
                  const dateWiseTested = dates[dateKey].total.tested
                    ? dates[dateKey].total.tested
                    : 0

                  dateWiseList.push({
                    date: dateKey,
                    dateWiseConfirm,
                    dateWiseRecover,
                    dateWiseDeceased,
                    dateWiseTested,
                    dateWiseActive:
                      dateWiseConfirm - (dateWiseDeceased + dateWiseRecover),
                  })
                }
              })
              return dateWiseList
            }

            const dateWiseData = convertDate()
            const start = dateWiseData.length - 10
            const end = dateWiseData.length
            const sortedData = dateWiseData.slice(start, end)
            console.log(sortedData)

            specificList.push({
              stateCode: keyName,
              dates,
              name: statesList.find(
                eachState => eachState.state_code === keyName,
              ).state_name,
              districts,
              sortedData,
              dateWiseData,
            })
          }
        })
        return specificList
      }

      const specificStateData = convertObjectToArray()
      this.setState({
        timelineData: specificStateData,
        status: apiStatus.success,
      })
    } else {
      this.setState({status: apiStatus.failed})
    }
  }

  activateConfirm = () => {
    const {orderedDistrictArray} = this.state
    orderedDistrictArray.sort((a, b) => b.totalConfirm - a.totalConfirm)
    this.setState({
      isConfirmActive: true,
      isActiveActive: false,
      isRecoverActive: false,
      isDeceasedActive: false,
      orderedDistrictArray,
    })
  }

  activateActive = () => {
    const {orderedDistrictArray} = this.state
    orderedDistrictArray.sort((a, b) => b.totalActive - a.totalActive)
    this.setState({
      isActiveActive: true,
      isConfirmActive: false,
      isRecoverActive: false,
      isDeceasedActive: false,
      orderedDistrictArray,
    })
  }

  activateRecover = () => {
    const {orderedDistrictArray} = this.state
    orderedDistrictArray.sort((a, b) => b.totalRecover - a.totalRecover)
    this.setState({
      isRecoverActive: true,
      isActiveActive: false,
      isConfirmActive: false,
      isDeceasedActive: false,
      orderedDistrictArray,
    })
  }

  activateDeceased = () => {
    const {orderedDistrictArray} = this.state
    orderedDistrictArray.sort((a, b) => b.totalDeceased - a.totalDeceased)
    this.setState({
      isDeceasedActive: true,
      isConfirmActive: false,
      isActiveActive: false,
      isRecoverActive: false,
      orderedDistrictArray,
    })
  }

  renderBarChart = data1 => {
    const {
      isConfirmActive,
      isActiveActive,
      isRecoverActive,
      isDeceasedActive,
    } = this.state
    const CustomizedLabel = props => {
      const {x, y, fill, value} = props
      const DataFormatter = number => {
        if (number > 1000 && number < 100000) {
          return `${(number / 1000).toString()}K`
        }
        if (number > 100000 && number < 1000000) {
          return `${(number / 100000).toString()}L`
        }
        if (number > 1000000 && number < 10000000) {
          return `${(number / 1000000).toString()}M`
        }
        if (number > 10000000) {
          return `${(number / 1000000).toString()}C`
        }
        return number.toString()
      }
      return (
        <text x={x} y={y} fill={fill}>
          {DataFormatter(value)}
        </text>
      )
    }

    /* dateFormat function */

    const dateFormat = dateString => {
      const formatted = new Date(dateString)
      const month = formatted.toLocaleString('default', {month: 'short'})
      const date = formatted.getDate()
      const suffix = () => {
        switch (date) {
          case date < 10:
            return 0
          default:
            return ''
        }
      }
      const formatedDate = `${suffix()}${date} ${month}`
      return formatedDate.toUpperCase()
    }

    return (
      <div className="barchart-container">
        <BarChart
          width={1050}
          height={450}
          data={data1}
          barGap={50}
          barCategoryGap={50}
          margin={{top: 20, right: 10, left: 10, bottom: 10}}
        >
          <XAxis
            tickFormatter={dateFormat}
            dataKey="date"
            stroke={0}
            tick={{
              fill:
                (isConfirmActive && '#9a0e31') ||
                (isActiveActive && '#0A4FA0') ||
                (isRecoverActive && '#216837') ||
                (isDeceasedActive && '#474C57'),
            }}
            tickMargin={10}
          />
          <Bar
            barSize={60}
            dataKey={
              (isConfirmActive && 'dateWiseConfirm') ||
              (isActiveActive && 'dateWiseActive') ||
              (isDeceasedActive && 'dateWiseDeceased') ||
              (isRecoverActive && 'dateWiseRecover')
            }
            fill={
              (isConfirmActive && '#9a0e31') ||
              (isActiveActive && '#0A4FA0') ||
              (isRecoverActive && '#216837') ||
              (isDeceasedActive && '#474C57')
            }
            label={
              <CustomizedLabel
                position="top"
                fill={
                  (isConfirmActive && '#9a0e31') ||
                  (isActiveActive && '#0A4FA0') ||
                  (isRecoverActive && '#216837') ||
                  (isDeceasedActive && '#474C57')
                }
              />
            }
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </div>
    )
  }

  /* createDate function */
  createDate = () => {
    const {specificData} = this.state
    const last = specificData.map(each => each.lastUpdate)
    const newDate = last[0]
    const myDate = new Date(newDate).getDate()
    const myYear = new Date(newDate).getFullYear()
    const myMonth = new Date(newDate).toLocaleString('default', {month: 'long'})

    const place = () => {
      switch (myDate) {
        case 1:
          return 'st'
        case 2:
          return 'nd'
        case 3:
          return 'rd'
        default:
          return 'th'
      }
    }
    const updated = `${myMonth} ${myDate}${place()} ${myYear}`
    return updated.toLowerCase()
  }

  DataFormatter1 = number => {
    if (number > 1000 && number < 100000) {
      return `${(number / 1000).toString()}K`
    }
    if (number > 100000 && number < 1000000) {
      return `${(number / 100000).toString()}L`
    }
    if (number > 1000000) {
      return `${(number / 1000000).toString()}M`
    }
    if (number > 10000000) {
      return `${(number / 1000000).toString()}C`
    }
    return number.toString()
  }

  renderConfirmLineChart = data2 => (
    <div className="linechart-container">
      <p className="line-chart-label1">Confirmed</p>
      <LineChart
        width={1100}
        height={350}
        data={data2}
        margin={{top: 40, right: 50, left: 50, bottom: 40}}
      >
        <XAxis dataKey="date" stroke="#FF073A" interval={20} tickMargin={10} />
        <YAxis
          stroke="#FF073A"
          tickFormatter={this.DataFormatter1}
          domain={['dataMin', 'dataMax']}
          tickMargin={10}
        />
        <Tooltip
          wrapperStyle={{
            width: 88,
            color: '#FF073A',
            border: '1px solid #E2E8F0',
            borderRadius: 4,
            backgroundColor: '#E2E8F0',
          }}
          formatter={this.DataFormatter1}
          labelFormatter={value =>
            `${new Date(value).getDate()} ${new Date(
              value,
            ).toLocaleString('default', {month: 'long'})}`
          }
          contentStyle={{fontSize: 12}}
        />
        <Line
          type="monotone"
          dataKey="dateWiseConfirm"
          fill="#FF073A"
          stroke="#FF073A"
        />
      </LineChart>
    </div>
  )

  renderActiveLineChart = data3 => (
    <div className="linechart-container0">
      <p className="line-chart-label2">Active</p>
      <LineChart
        width={1100}
        height={350}
        data={data3}
        margin={{top: 40, right: 50, left: 50, bottom: 40}}
      >
        <XAxis dataKey="date" stroke="#007BFF" interval={20} tickMargin={10} />
        <YAxis
          stroke="#007BFF"
          tickFormatter={this.DataFormatter1}
          domain={['dataMin', 'dataMax']}
          tickMargin={10}
        />
        <Tooltip
          wrapperStyle={{
            width: 88,
            color: '#007BFF',
            border: '1px solid #E2E8F0',
            borderRadius: 4,
            backgroundColor: '#E2E8F0',
          }}
          formatter={this.DataFormatter1}
          labelFormatter={value =>
            `${new Date(value).getDate()} ${new Date(
              value,
            ).toLocaleString('default', {month: 'long'})}`
          }
          contentStyle={{fontSize: 12}}
        />
        <Line
          type="monotone"
          dataKey="dateWiseActive"
          fill="#007BFF"
          stroke="#007BFF"
        />
      </LineChart>
    </div>
  )

  renderRecoveredLineChart = data4 => (
    <div className="linechart-container1">
      <p className="line-chart-label3">Recovered</p>
      <LineChart
        width={1100}
        height={350}
        data={data4}
        margin={{top: 40, right: 50, left: 50, bottom: 40}}
      >
        <XAxis dataKey="date" stroke="#27A243" interval={20} tickMargin={10} />
        <YAxis
          stroke="#27A243"
          tickFormatter={this.DataFormatter1}
          domain={['dataMin', 'dataMax']}
          tickMargin={10}
        />
        <Tooltip
          wrapperStyle={{
            width: 88,
            color: '#27A243',
            border: '1px solid #E2E8F0',
            borderRadius: 4,
            backgroundColor: '#E2E8F0',
          }}
          formatter={this.DataFormatter1}
          labelFormatter={value =>
            `${new Date(value).getDate()} ${new Date(
              value,
            ).toLocaleString('default', {month: 'long'})}`
          }
          contentStyle={{fontSize: 12}}
        />
        <Line
          type="monotone"
          dataKey="dateWiseRecover"
          fill="#27A243"
          stroke="#27A243"
        />
      </LineChart>
    </div>
  )

  renderDeceasedLineChart = data5 => (
    <div className="linechart-container2">
      <p className="line-chart-label4">Deceased</p>
      <LineChart
        width={1100}
        height={350}
        data={data5}
        margin={{top: 40, right: 50, left: 50, bottom: 40}}
      >
        <XAxis dataKey="date" stroke="#6C757D" interval={20} tickMargin={10} />
        <YAxis
          stroke="#6C757D"
          tickFormatter={this.DataFormatter1}
          domain={['dataMin', 'dataMax']}
          tickMargin={10}
        />
        <Tooltip
          wrapperStyle={{
            width: 88,
            color: '#6C757D',
            border: '1px solid #E2E8F0',
            borderRadius: 4,
            backgroundColor: '#E2E8F0',
          }}
          formatter={this.DataFormatter1}
          labelFormatter={value =>
            `${new Date(value).getDate()} ${new Date(
              value,
            ).toLocaleString('default', {month: 'long'})}`
          }
          contentStyle={{fontSize: 12}}
        />
        <Line
          type="monotone"
          dataKey="dateWiseDeceased"
          fill="#6C757D"
          stroke="#6C757D"
        />
      </LineChart>
    </div>
  )

  renderTestedLineChart = data6 => (
    <div className="linechart-container3">
      <p className="line-chart-label5">Tested</p>
      <LineChart
        width={1100}
        height={350}
        data={data6}
        margin={{top: 40, right: 50, left: 50, bottom: 40}}
      >
        <XAxis dataKey="date" stroke="#9673B9" interval={20} tickMargin={10} />
        <YAxis
          stroke="#9673B9"
          tickFormatter={this.DataFormatter1}
          domain={['dataMin', 'dataMax']}
          tickMargin={10}
        />
        <Tooltip
          wrapperStyle={{
            width: 88,
            color: '#9673B9',
            border: '1px solid #E2E8F0',
            borderRadius: 4,
            backgroundColor: '#E2E8F0',
          }}
          formatter={this.DataFormatter1}
          labelFormatter={value =>
            `${new Date(value).getDate()} ${new Date(
              value,
            ).toLocaleString('default', {month: 'long'})}`
          }
          contentStyle={{fontSize: 12}}
        />
        <Line
          type="monotone"
          dataKey="dateWiseTested"
          fill="#9673B9"
          stroke="#9673B9"
        />
      </LineChart>
    </div>
  )

  loadingView = () => (
    <div className="loader-container" testid="stateDetailsLoader">
      <Loader type="TailSpin" color="#007BFF" height="50" width="50" />
    </div>
  )

  timeLineLoadingView = () => (
    <div className="loader-container" testid="timelinesDataLoader">
      <Loader type="TailSpin" color="#007BFF" height="50" width="50" />
    </div>
  )

  renderSpecificStateView = () => {
    const {
      isConfirmActive,
      isActiveActive,
      isRecoverActive,
      isDeceasedActive,
      specificData,
      orderedDistrictArray,
    } = this.state

    console.log(orderedDistrictArray)
    const {
      name,
      active,
      confirmed,
      recovered,
      deceased,
      tested,
    } = specificData[0]
    return (
      <>
        <div className="top-container">
          <div className="state-name-container">
            <h1 className="state">{name}</h1>
            <p className="last-update">Last update on {this.createDate()}.</p>
          </div>
          <div className="tested-container">
            <p className="tested">Tested</p>
            <p className="tested-count">{tested}</p>
          </div>
        </div>
        <div className="corona-container1">
          <button
            onClick={this.activateConfirm}
            type="button"
            className={
              isConfirmActive ? 'confirm-active-button' : 'empty-button1'
            }
          >
            <div
              testid="stateSpecificConfirmedCasesContainer"
              className="country-wide-containers1"
            >
              <p className="confirm">Confirmed</p>
              <img
                src="https://res.cloudinary.com/dlewtcmlt/image/upload/v1672728823/Group_xk7lvp.png"
                alt="state specific confirmed cases pic"
                className="case-icon"
              />
              <p className="overall-count1">{confirmed}</p>
            </div>
          </button>
          <button
            onClick={this.activateActive}
            type="button"
            className={
              isActiveActive ? 'active-active-button' : 'empty-button1'
            }
          >
            <div
              testid="stateSpecificActiveCasesContainer"
              className="country-wide-containers1"
            >
              <p className="active">Active</p>
              <img
                src="https://res.cloudinary.com/dlewtcmlt/image/upload/v1672728823/protection_1_lkmhql.png"
                alt="state specific active cases pic"
                className="case-icon"
              />
              <p className="overall-count2">{active}</p>
            </div>
          </button>
          <button
            onClick={this.activateRecover}
            type="button"
            className={
              isRecoverActive ? 'recover-active-button' : 'empty-button1'
            }
          >
            <div
              testid="stateSpecificRecoveredCasesContainer"
              className="country-wide-containers1"
            >
              <p className="recover">Recovered</p>
              <img
                src="https://res.cloudinary.com/dlewtcmlt/image/upload/v1672728842/recovered_1_huy4pf.png"
                alt="state specific recovered cases pic"
                className="case-icon"
              />
              <p className="overall-count3">{recovered}</p>
            </div>
          </button>
          <button
            onClick={this.activateDeceased}
            type="button"
            className={
              isDeceasedActive ? 'deceased-active-button' : 'empty-button1'
            }
          >
            <div
              testid="stateSpecificDeceasedCasesContainer"
              className="country-wide-containers1"
            >
              <p className="decease">Deceased</p>
              <img
                src="https://res.cloudinary.com/dlewtcmlt/image/upload/v1672728823/Outline_hgn6eh.png"
                alt="state specific deceased cases pic"
                className="case-icon"
              />
              <p className="overall-count4">{deceased}</p>
            </div>
          </button>
        </div>
        <div className="top-district-container">
          <h1 className="top-district">Top Districts</h1>

          <ul
            testid="topDistrictsUnorderedList"
            className="confirm-district-container"
          >
            {orderedDistrictArray.map(item => (
              <Districts
                key={item.district}
                districtDetails={item}
                isConfirmActive={isConfirmActive}
                isActiveActive={isActiveActive}
                isDeceasedActive={isDeceasedActive}
                isRecoverActive={isRecoverActive}
              />
            ))}
          </ul>
        </div>
      </>
    )
  }

  renderTimeline = () => {
    const {status, timelineData} = this.state
    const timelineKey = Object.keys(timelineData)
    const timelineObj = []
    timelineKey.forEach(each => {
      if (timelineData[each]) {
        const {dateWiseData} = timelineData[each]
        const {sortedData} = timelineData[each]

        timelineObj.push(dateWiseData)
        timelineObj.push(sortedData)
      }
    })
    console.log(timelineObj)

    return (
      <>
        {status === apiStatus.inProgress ? (
          this.timeLineLoadingView()
        ) : (
          <>
            {this.renderBarChart(timelineObj[1])}
            <div
              className="daily-spread-container"
              testid="lineChartsContainer"
            >
              <h1 className="daily-spread">Daily Spread Trends</h1>
              {this.renderConfirmLineChart(timelineObj[0])}
              {this.renderActiveLineChart(timelineObj[0])}
              {this.renderRecoveredLineChart(timelineObj[0])}
              {this.renderDeceasedLineChart(timelineObj[0])}
              {this.renderTestedLineChart(timelineObj[0])}
            </div>

            <Footer />
          </>
        )}
      </>
    )
  }

  renderViews = () => {
    const {status} = this.state
    switch (status) {
      case apiStatus.inProgress:
        return this.loadingView()
      case apiStatus.success:
        return this.renderSpecificStateView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="bg-container">
        <Header />
        {this.renderViews()}
        {this.renderTimeline()}
      </div>
    )
  }
}

export default SpecificState
