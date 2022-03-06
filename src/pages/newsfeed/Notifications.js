import React from 'react'
import Notis from '../../components/newsfeed/Notis'
import Sidebar from '../../components/newsfeed/Sidebar'
import Widget from '../../components/newsfeed/Widget'



function Notifications() {

  return (
    <div className='bg-white min-h-screen flex max-w-[1500px] mx-auto'>
        <Sidebar/>
        <Notis/>
        <Widget/>
    </div>
  )
}

export default Notifications