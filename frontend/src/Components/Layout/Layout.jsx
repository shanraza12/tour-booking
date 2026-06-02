import React from 'react'
import Header from '../Header/Header'
import Router from '../../Router/Routers'
import Footer from '../Footer/Footer'
import ThemeWidget from '../ThemeWidget'
import SkyWidget from "../SkyWidget"

const Layout = () => { 
  return (
    <div>
        <Header/>
        <Router/>
        <Footer/>
        <SkyWidget/>
        <ThemeWidget/>
    </div>
  )
}

export default Layout