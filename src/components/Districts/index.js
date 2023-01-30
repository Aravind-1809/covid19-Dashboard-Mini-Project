import './index.css'

const Districts = props => {
  const {
    districtDetails,
    isConfirmActive,
    isActiveActive,
    isRecoverActive,
    isDeceasedActive,
  } = props
  const {
    district,
    totalConfirm,
    totalActive,
    totalDeceased,
    totalRecover,
  } = districtDetails

  return (
    <li className="district-list">
      <p className="numbs">
        {(isConfirmActive && totalConfirm) ||
          (isActiveActive && totalActive) ||
          (isRecoverActive && totalRecover) ||
          (isDeceasedActive && totalDeceased)}
      </p>
      <p className="dist">{district}</p>
    </li>
  )
}

export default Districts
