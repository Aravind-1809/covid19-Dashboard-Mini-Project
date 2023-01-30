import React from 'react'

const CovidContext = React.createContext({
  totalConfirm: 0,
  totalActive: 0,
  totalRecover: 0,
  totalDeceased: 0,
  toCalculateConfirm: () => {},
  toSetApiData: () => {},
})

export default CovidContext
