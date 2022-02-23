import React, { useState, useEffect } from 'react';
import AdminNavbar from './AdminNavbar';
import { NavLink } from 'react-router-dom';
import Icon from '@material-tailwind/react/Icon';
import H5 from '@material-tailwind/react/Heading5';
import { OfficeBuildingIcon, UserGroupIcon } from '@heroicons/react/solid';
import { UserGroupIcon as GStaffIcon } from '@heroicons/react/outline';
import Logo from "../../assets/img/faviconEdu.png";
import { useSelector } from 'react-redux'; //redux
import { selectUser } from '../../features/userSlice';


function Sidebar() {

    const [showSidebar, setShowSidebar] = useState('-left-64');

    const user = useSelector(selectUser);
    const email = user.email;
    const role = email.split("edubase.")[1];


    return(
        <>
            <AdminNavbar showSidebar={showSidebar} setShowSidebar={setShowSidebar}/>
            <div className={`h-screen fixed top-0 md:left-0 ${showSidebar} overflow-y-auto flex-row flex-nowrap overflow-hidden shadow-xl bg-white w-64 z-50 py-4 px-6 transition-all duration-300 `}>
                <div className="flex-col items-stretch min-h-full flex-nowrap px-0 relative">

                    <span
                        className="mt-2 text-center w-full inline-block"
                    >   
                        <NavLink to='/dashboard' exact className="flex items-center justify-between bg-white shadow-none">
                            <img src={ Logo } alt="Edubase" width="70" height="70"/>
                            <H5 color="gray">
                                Dashboard   
                            </H5>
                        </NavLink> 
                    </span>
                    
                    <div className='flex flex-col'>
                        <hr className='my-4 min-w-full'/>
                        <ul className="flex-col min-w-full flex list-none">

                            {
                                role === "qac" && (
                                    <>
                                        <li className="rounded-lg mb-4">
                                            <NavLink
                                                exact
                                                activeClassName="active"
                                                to="/dashboard"
                                                className="flex items-center gap-4 text-sm text-gray-700 font-light px-4 py-3 rounded-lg"
                                            >
                                                <Icon name="dashboard" size="2xl" />
                                                Dashboard
                                            </NavLink>
                                        </li>

                                        <li className="rounded-lg mb-3">
                                            <NavLink
                                                exact
                                                activeClassName="active"
                                                to="/general-staffs"
                                                className="flex items-center gap-4 text-sm text-gray-700 font-light px-4 py-3 rounded-lg"
                                            >
                                                <GStaffIcon className="h-6" />
                                                General Staffs
                                            </NavLink>
                                        </li>
                                    </>
                                )
                            }

                            {
                                role === "qam" && (
                                    <>
                                        <li className="rounded-lg mb-4">
                                            <NavLink
                                                exact
                                                activeClassName="active"
                                                to="/dashboard"
                                                className="flex items-center gap-4 text-sm text-gray-700 font-light px-4 py-3 rounded-lg"
                                            >
                                                <Icon name="dashboard" size="2xl" />
                                                Dashboard
                                            </NavLink>
                                        </li>
                                        
                                        <li className="rounded-lg mb-3">
                                            <NavLink
                                                exact
                                                activeClassName="active"
                                                to="/categories"
                                                className="flex items-center gap-4 text-sm text-gray-700 font-light px-4 py-3 rounded-lg"
                                            >
                                                <Icon name="list" size="2xl" />
                                                Categories
                                            </NavLink>
                                        </li>

                                        <li className="rounded-lg mb-3">
                                            <NavLink
                                                exact
                                                activeClassName="active"
                                                to="/departments"
                                                className="flex items-center gap-4 text-sm text-gray-700 font-light px-4 py-3 rounded-lg"
                                            >
                                                <OfficeBuildingIcon className="h-6" />
                                                Departments
                                            </NavLink>
                                        </li>

                                        <li className="rounded-lg mb-3">
                                            <NavLink
                                                exact
                                                activeClassName="active"
                                                to="/admin-staffs"
                                                className="flex items-center gap-4 text-sm text-gray-700 font-light px-4 py-3 rounded-lg"
                                            >
                                                <UserGroupIcon className='h-6' />
                                                Administration Staffs
                                            </NavLink>
                                        </li>

                                        <li className="rounded-lg mb-3">
                                            <NavLink
                                                exact
                                                activeClassName="active"
                                                to="/general-staffs"
                                                className="flex items-center gap-4 text-sm text-gray-700 font-light px-4 py-3 rounded-lg"
                                            >
                                                <GStaffIcon className="h-6" />
                                                General Staffs
                                            </NavLink>
                                        </li>
                                    </>
                                    
                                )
                            }
                            
                        </ul>
                    </div>

                </div>
            </div>
        </>
    );
}

export default Sidebar;
