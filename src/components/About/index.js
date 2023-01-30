/* eslint-disable react/no-unknown-property */
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Footer from '../Footer'
import Header from '../Header'
import FaqItems from '../FaqItems'
import './index.css'

const apiStatus = {
  initial: 'INITIAL',
  inProgress: 'PROGRESS',
  failed: 'FAILED',
  success: 'SUCCESS',
}

class About extends Component {
  state = {faqData: [], status: apiStatus.initial}

  componentDidMount() {
    this.getAboutApi()
  }

  getAboutApi = async () => {
    this.setState({status: apiStatus.inProgress})
    const url = 'https://apis.ccbp.in/covid19-faqs'
    const response = await fetch(url)
    if (response.ok) {
      const data = await response.json()
      console.log(data)
      const {faq} = data
      console.log(faq)
      this.setState({faqData: faq, status: apiStatus.success}, this.render)
    } else {
      this.setState({status: apiStatus.failed})
    }
  }

  loadingView = () => (
    <div className="loader-container" testid="aboutRouteLoader">
      <Loader type="TailSpin" color="#007BFF" height="50" width="50" />
    </div>
  )

  renderFaqs = () => {
    const {faqData} = this.state
    console.log(faqData)

    return (
      <ul className="faq-result-container" testid="faqsUnorderedList">
        {faqData.map(each => (
          <FaqItems key={each.qno} details={each} />
        ))}
      </ul>
    )
  }

  render() {
    const {status} = this.state
    return (
      <div className="bg-container">
        <Header />
        {status === apiStatus.success ? (
          <>
            <div className="about-container">
              <h1 className="about-head">About</h1>
              <p className="about-last-update">
                Last update on march 28th 2021.
              </p>
              <p className="about-subhead">
                COVID-19 vaccines be ready for distribution
              </p>
              {this.renderFaqs()}
            </div>
            <Footer />
          </>
        ) : (
          this.loadingView()
        )}
      </div>
    )
  }
}

export default About
