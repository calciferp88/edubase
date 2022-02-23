import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/newsfeed/Sidebar';
import Widget from '../../components/newsfeed/Widget';
import ShareForm from './ShareForm';

// for route
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

function Share() {

    document.title = "EduBase | Share your idea";

    const location = useLocation();
    const categoryid   = location.state.sharecate.id;
    const categoryname = location.state.sharecate.categoryName;
    const closuredate = new Date(location.state.sharecate.closureDate.seconds*1000).toLocaleDateString();
    const finalClosuredate = new Date(location.state.sharecate.finalClosureDate.seconds*1000).toLocaleDateString();
    console.log(closuredate);

    return (
        
        <div className='bg-white min-h-screen flex max-w-[1500px] mx-auto'>
            <Sidebar/>
            <ShareForm 
                categoryname = {categoryname} 
                categoryid   = {categoryid} 
                closureDate = {closuredate}
                finalClosuredate = {finalClosuredate}
            />
            <Widget/>
        </div>
    );
}

export default Share;
