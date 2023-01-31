import React from 'react'

const CovidContext = React.createContext({
  displayMobileView: () => {},
  showNavs: false,
  displayMenus: () => {},
})

export default CovidContext
