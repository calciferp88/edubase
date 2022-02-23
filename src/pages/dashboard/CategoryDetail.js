import React, { useState } from 'react';
import Footer from '../../components/dashboard/Footer';
import Sidebar from '../../components/dashboard/Sidebar';

// for route
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

// metarial tailwind card
import Card from '@material-tailwind/react/Card';
import CardHeader from '@material-tailwind/react/CardHeader';
import CardBody from '@material-tailwind/react/CardBody';

// For firebase
import { 
    collection, 
    doc,
    updateDoc,
    getDocs,
    query, 
    serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../config';
import Moment from "react-moment";
import moment from "moment";    


function CategoryDetail() {

    document.title = "Dashboard | Category Detail";

    //  location  
    const location = useLocation();

    const closuredate  = new Date(location.state.detailcat.closureDate.seconds*1000).toLocaleDateString();
    const fclosuredate = new Date(location.state.detailcat.finalClosureDate.seconds*1000).toLocaleDateString();
    
    return (

        <>
            <Sidebar/>
            <div className='md:ml-64'>
                <div className="bg-light-blue-500 pt-14 pb-28 px-3 md:px-8 h-auto">
                </div>

                <div className="px-3 md:px-8 h-auto -mt-24">
                    <div className="container mx-auto max-w-full">
                        <div className="grid grid-cols-1 px-4 mb-16">

                            <Card>
                                <CardHeader color="pink" contentPosition="none">
                                    <div className="mb-2">
                                        <NavLink to='/dashboard'  className="text-sm hover:font-semibold">Dashboard </NavLink> / 
                                        <NavLink to='/categories'  className="text-sm hover:font-semibold">Categories</NavLink> /
                                    </div>
                                    <div className="w-full flex items-center">
                                        <h2 className="text-white text-2xl font-bold">Category Detail</h2>
                                    </div>
                                </CardHeader>

                                <CardBody>
                                    <div className="flex items-center text-gray-800 mb-7">
                                        <span className="font-semibold w-[140px]">Category Name</span>
                                        <span className="ml-2">:&nbsp;&nbsp; {location.state.detailcat.categoryName}</span>
                                    </div>
                                    <div className="flex items-center text-gray-800 mb-7">
                                        <span className="font-semibold w-[140px]">Category Status</span>
                                        <span className={`ml-2 ${location.state.detailcat.categoryStatus === "Published" && 'text-green-600'}`}>
                                            :&nbsp;&nbsp; {location.state.detailcat.categoryStatus}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-gray-800 mb-7">
                                        <span className="font-semibold w-[140px]">Closure Date</span>
                                        <span className="ml-2">:&nbsp;&nbsp; {closuredate}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-gray-800 mb-7">
                                        <span className="font-semibold w-[140px]">Final Closure Date</span>
                                        <span className="ml-2">:&nbsp;&nbsp; {fclosuredate}</span>
                                    </div>
                                    <div className="flex items-center text-gray-800 mb-7">
                                        <span className="font-semibold w-[140px]">Description</span>
                                        <span className="ml-2">:&nbsp;&nbsp; 
                                            {location.state.detailcat.description}
                                        </span>
                                    </div>
                                </CardBody>

                            </Card>

                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        </>
        
    )
}

export default CategoryDetail;
