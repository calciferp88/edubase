import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { HomeIcon, SearchIcon } from "@heroicons/react/solid";
import { BellIcon } from "@heroicons/react/outline";
import {
    HashtagIcon,
    UserIcon,
    DotsHorizontalIcon,
    TrendingUpIcon,
    LogoutIcon,
} from "@heroicons/react/outline";
import { Avatar } from '@material-ui/core';
import Logo from "../../assets/img/faviconEdu.png";
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/userSlice';
import { useDispatch } from "react-redux";
import { auth } from '../../config';
import { logout } from "../../features/userSlice";
import Modal from "@material-tailwind/react/Modal";
import ModalHeader from "@material-tailwind/react/ModalHeader";
import ModalBody from "@material-tailwind/react/ModalBody";
import ModalFooter from "@material-tailwind/react/ModalFooter";
import Button from '@material-tailwind/react/Button';
// For firebase
import { 
    collection, 
    addDoc,
    getDocs, 
    serverTimestamp,
    orderBy, 
    query,
    updateDoc,
    deleteDoc,
    doc,
    where,
    onSnapshot
} from 'firebase/firestore';
import { db } from '../../config';


function Sidebar() {

    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const [ loading, setLoading ] = useState(false);
    const [showModal1, setShowModal1] = useState(false); //confirmation dialog
    const [ notifications, setNotifications ] = useState([]); // to count noti counts

    const dispatch = useDispatch();
    
    // reterive own notification
    useEffect(() =>{
        if(user){
            onSnapshot(
                query(collection(db, "notification"), where("authorEmail", "==", user?.email), where("status", "==", 0)),
                    (snapshot) => {
                        setNotifications(snapshot.docs.map((doc) => ({
                            ...doc.data(), id: doc.id
                        })));
                    }   
                )
        }
    }, [db, user]);

    // Logout
    const Logout = () => {
        dispatch(logout());
        setLoading(true);
        auth.signOut();
        navigate('/login');
        setLoading(false);
    }

    return (
        <>
        <div className="hidden lg:flex flex-col items-center xl:items-start xl:w-[340px] sm:w-[100px] p-2 fixed h-full">
            
            {/* Logo */}
            <div className='flex items-center justify-center  hoverAnimation p-0 xl:ml-0 sm:-ml-4'>
                <NavLink exact to="/" className="bg-white shadow-none">
                    <img
                        src={Logo}
                        alt="EduBase"
                        width={66}
                        height={66}
                        title="EduBase"
                        className='-mt-1'
                    />
                </NavLink>
            </div>

            {/* NavLinks */}
            <div className="space-y-2.5 mt-10 mb-2.5 xl:ml-12 sm:-ml-4">
                <ul className="flex-col flex list-none">

                    <li className='rounded-lg mb-4 hover:bg-gray-300 hover:shadow-md cursor-pointer'>
                        <NavLink
                            exact
                            activeClassName="active"
                            to="/"
                            className="flex items-center gap-4 text-md font-light px-4 py-3 rounded-lg"
                        >
                            <HomeIcon className='h-5'/>
                            <span className='xl:inline sm:hidden'>Home</span>
                        </NavLink>
                    </li>

                    <li className='rounded-lg mb-4 hover:bg-gray-300 hover:shadow-md cursor-pointer'>
                        <NavLink
                            exact
                            activeClassName="active"
                            to="/explore"
                            className="flex items-center gap-4 text-md font-light px-4 py-3 rounded-lg"
                        >
                            <SearchIcon className='h-5'/>
                            <span className='xl:inline sm:hidden'>Explore</span>
                        </NavLink>
                    </li>

                    <li className='rounded-lg mb-4 hover:bg-gray-300 hover:shadow-md cursor-pointer'>
                        <NavLink
                            exact
                            activeClassName="active"
                            to="/profile"
                            className="flex items-center gap-4 text-md font-light px-4 py-3 rounded-lg"
                        >
                            <UserIcon className='h-5'/>
                            <span className='xl:inline sm:hidden'>Profile</span>
                        </NavLink>
                    </li>

                    <li className='rounded-lg mb-4 hover:bg-gray-300 hover:shadow-md cursor-pointer'>
                        <NavLink
                            exact
                            activeClassName="active"
                            to="/notifications"
                            className="flex items-center gap-4 text-md font-light px-4 py-3 rounded-lg"
                            >
                                <BellIcon className='h-5'/>
                                <span className='xl:inline sm:hidden flex items-center'>
                                Notifications 
                                <span className='shadow-sm bg-pink-500 text-sm pt-[1px] w-[20px] h-[20px] text-center rounded-xl ml-2 text-white'>
                                    {notifications.length}
                                </span>
                            </span>
                        </NavLink>
                    </li>
                </ul>
            </div>

            {/* Mini profile */}
            <div 
                onClick={() => {
                    setShowModal1(true)
                }}
                className="text-gray-800 flex items-center justify-center mt-auto
                xl:ml-24 sm:-ml-6 xl:mr-1 sm:mr-0 mb-8 cursor-pointer bg-gray-300 xl:p-2 sm:p-1 rounded-lg shadow-md hover:shadow-none"
            >
                <Avatar className="w-10 h-10 rounded-full mr-2.5 xl:ml-0 sm:ml-2 border border-gray-500 uppercase">
                    {user.email[0]}
                </Avatar>
                <div className="leading-5 xl:inline sm:hidden">
                    <h6 className="font-medium">{user.email}</h6>
                    <p className="text-gray-600 text-sm">
                        {
                            loading ? "signing out..." : "sign out"
                        }
                    </p>
                </div>
                {" "}
            </div>

        </div>

        {/* Confirmation dialog */}
        <Modal size="medium" active={showModal1} toggler={() => setShowModal1(false)}>

            <ModalHeader toggler={() => setShowModal1(false)}>
                <h2 className="flex item-center text-gray-800">
                    <LogoutIcon className='h-6' /> &nbsp; <span className="-mt-1"> Sign out? </span>
                </h2>
            </ModalHeader>

            <ModalBody>
                <p>Are you sure you want to leave?</p>
            </ModalBody>

            <ModalFooter>
                <Button 
                    color="gray"
                    onClick={(e) => setShowModal1(false)}
                    ripple="dark"
                >
                    No
                </Button>

                <Button
                    color="blue"
                    onClick={Logout}
                    ripple="light"
                >
                    Yes, Sign out
                </Button>
            </ModalFooter>
        </Modal>
        </>
    )
}

export default Sidebar
