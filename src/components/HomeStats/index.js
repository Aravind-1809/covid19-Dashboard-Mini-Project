/* eslint-disable import/no-mutable-exports */
/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
import './index.css'
import HomeStatsList from '../HomeStatsList'

export const caseList = []

const HomeStats = props => {
  const {data} = props

  const renderStateWiseDetails = () => (
    <>
      {data.map(each => (
        <HomeStatsList key={each.stateCode} details={each} />
      ))}
    </>
  )

  return <>{renderStateWiseDetails()}</>
}

export default HomeStats
