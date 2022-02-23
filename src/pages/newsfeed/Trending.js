import React from 'react'
import Sidebar from '../../components/newsfeed/Sidebar'
import TrendingFeed from '../../components/newsfeed/TrendingFeed'
import Widget from '../../components/newsfeed/Widget'

function Trending() {
  return (
    <div className='bg-white min-h-screen flex max-w-[1500px] mx-auto'>
        <Sidebar/>
        <TrendingFeed/>
        <Widget/>
    </div>
  )
}

export default Trending