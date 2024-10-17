import React, { Children } from 'react'
import Header from './Header'
import Footer from './Footer'

export const Layout = ({ children }) => {
  return (
    <div>
      {/* <Header /> */}
      <div className='content'>
        {children}
      </div>
      {/* <Footer /> */}
    </div>
  )
}
