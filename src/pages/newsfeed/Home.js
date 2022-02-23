import React from 'react';
import Sidebar from '../../components/newsfeed/Sidebar';
import Feed from '../../components/newsfeed/Feed';
import Widget from '../../components/newsfeed/Widget';


function Home() {
    return (
        <div className='bg-white min-h-screen flex max-w-[1500px] mx-auto'>
            <Sidebar/>
            <Feed/>
            <Widget/>
        </div>
    );
}

export default Home;
