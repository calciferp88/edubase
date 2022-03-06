import React, { useState, useEffect } from 'react';
import { HomeIcon, SearchIcon } from "@heroicons/react/solid";
import { BellIcon } from "@heroicons/react/outline";
import {
    ChevronDoubleUpIcon,
    PlusCircleIcon,
    LogoutIcon,
} from "@heroicons/react/outline";
import Icon from '@material-tailwind/react/Icon';
import Dropdown from '@material-tailwind/react/Dropdown';
import DropdownItem from '@material-tailwind/react/DropdownItem';
import { NavLink, useNavigate } from 'react-router-dom';
import Post from './Post';
import { Avatar } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux'; //redux
import { selectUser } from '../../features/userSlice';
import { auth } from '../../config';
import { logout } from "../../features/userSlice";

// modal
import Modal from "@material-tailwind/react/Modal";
import ModalHeader from "@material-tailwind/react/ModalHeader";
import ModalBody from "@material-tailwind/react/ModalBody";
import ModalFooter from "@material-tailwind/react/ModalFooter";
import Button from '@material-tailwind/react/Button';



// import FlipMove from 'react-flip-move';

// For firebase
import { 
    collection, 
    addDoc,
    getDocs, 
    serverTimestamp,
    orderBy, 
    query,
    deleteDoc,
    doc,
    onSnapshot,
    where,
    limit,
    startAfter
} from 'firebase/firestore';
import { db } from '../../config';

// Toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Feed() {

    const user = useSelector(selectUser);
    const [showModal1, setShowModal1] = useState(false); 
    const [showModal2, setShowModal2] = useState(false); //confirmation dialog
    const [ ideas, setIdeas ] = useState([]);
    const [ categories, setCategories ] = useState([]);
    // The back-to-top button is hidden at the beginning
    const [showButton, setShowButton] = useState(false);
    // for last doc
    const [lastDoc, setLastDoc] = useState(null);
    const [empty, setEmpty] = useState(false);


    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [ notifications, setNotifications ] = useState([]); // to count noti counts
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
        auth.signOut();
        navigate('/login');
    }

    // check current depth
    useEffect(() => {
        window.addEventListener("scroll", () => {
          if (window.pageYOffset > 300) {
            setShowButton(true);
          } else {
            setShowButton(false);
          }
        });
      }, []);

    //   scroll to top action
    const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // for smoothly scrolling
    });
    };


    // reterive and display categories
    useEffect(() =>{
        onSnapshot(
        query(collection(db, "category"), where("categoryStatus", "==", "Published")),
            (snapshot) => {
                setCategories(snapshot.docs.map((doc) => ({
                    ...doc.data(), id: doc.id
                })));
            }   
        )
    }, [db]);

    // retirve and display ideas
    useEffect(() =>{
        onSnapshot(
        query(collection(db, "idea"), orderBy("ideaDate", "desc"), limit(5)),
            (snapshot) => {
                const isCollectionEmpty = snapshot.docs.length === 0;
                if(!isCollectionEmpty){
                    const lastDocN = snapshot.docs[snapshot.docs.length-1]; // get last doc 
                    setIdeas(snapshot.docs); // give ideas value
                    setLastDoc(lastDocN); // give last doc 
                }else{
                    setEmpty(true);
                }

            }   
        )
    }, [db]);

    // for load more function
    const fetchmore = () => {
        onSnapshot(
            query(collection(db, "idea"), orderBy("ideaDate", "desc"), startAfter(lastDoc), limit(5)), //start after last docs
            (snapshot) => {
                const isCollectionEmpty = snapshot.docs.length === 0;
                if(!isCollectionEmpty)
                {
                    const lastDoc = snapshot.docs[snapshot.docs.length-1];
                    setIdeas((ideas) => [ ...ideas, ...snapshot.docs]);
                    setLastDoc(lastDoc);
                }else{
                    setEmpty(true);
                }
            }
        )
    }

    // For closure dates
    const dateObj = new Date();
    const month = dateObj.getUTCMonth() + 1; //months from 1-12
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();
    const todayDate = month + "/" + day + "/" + year;
    

    return (
        <div className="flex-grow flex-[0.4] border-l border-r border-gray-300 max-w-2xl sm:ml-[73px] xl:ml-[350px]">


            <ToastContainer 
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            {/* scroll to top */}
            {showButton && (
                <button onClick={scrollToTop} className="back-to-top fixed bottom-10 right-10 bg-black p-4 rounded hover:bg-gray-800">
                    <ChevronDoubleUpIcon className="h-5 mr-1 text-white"/>
                </button>
            )}
            {/* Header */}
            <div className="hidden lg:flex shadow-sm items-center sm:justify-between py-3 px-3 sticky top-0 z-10 border-b bg-white border-gray-300">
                <h2 className="text-xl sm:text-xl font-semibold">Idea Feed</h2>
                
                <div className="w-9 h-9 flex items-center justify-center xl:px-0 ml-auto">
                    <NavLink to="/me">
                        <Avatar style={{ fontSize: '17px', width: 37, height: 37 }} className="mr-2.5 xl:ml-0 sm:ml-2 border-2 border-gray-50 uppercase hover:animate-bounce">
                            {user.email[0]}
                        </Avatar>
                    </NavLink>
                </div>
            </div>

            {/* Mobile Header */}
            <div className="flex justify-between shadow-md lg:hidden items-center py-3 px-3 sticky top-0 z-10 border-b bg-white border-gray-300">
                <NavLink exact to="/" className="icon hover:animate-bounce">
                    <HomeIcon className='h-6'/>
                </NavLink>
                <NavLink exact to="/explore" className="icon hover:animate-bounce">
                    <SearchIcon className='h-6'/>
                </NavLink>
                <PlusCircleIcon 
                    className='h-6'
                    onClick={() => {
                        setShowModal1(true)
                    }}
                />
                <NavLink exact to="/notifications" className="icon hover:animate-bounce relative">
                    <BellIcon className='h-6'/>
                    <span className='-top-1 left-2 absolute shadow-sm bg-pink-500 text-sm pt-[1px] w-[20px] h-[20px] text-center rounded-xl ml-2 text-white'>
                         {notifications.length}
                    </span>
                </NavLink>
                <Dropdown
                    color="transparent"
                    buttonText={
                        <div className="w-12 icon hover:animate-bounce">
                            <Avatar style={{ fontSize: "17px", width: 30, height: 30 }}>
                                {user.email[0]}
                            </Avatar>
                        </div>
                    }
                    rounded
                    style={{
                        padding: 0,
                        width: "30px",
                        color: 'transparent',
                        cursor: 'pointer',
                    }}
                >
                    <NavLink to="/me">
                        <DropdownItem color="lightBlue">
                            Profile
                        </DropdownItem>
                    </NavLink>
                    <DropdownItem color="lightBlue">
                        Settings
                    </DropdownItem>
                    <DropdownItem color="lightBlue"
                        onClick={() => {
                            setShowModal2(true)
                        }}
                    >
                        Logout
                    </DropdownItem>
                </Dropdown>
            </div>
            
            {/* mobile categories modal */}
            <Modal size="lg" active={showModal1} toggler={() => setShowModal1(false)} >

                <ModalHeader toggler={() => setShowModal1(false)}>
                    <h2 className="flex item-center text-gray-800">
                        <Icon name="list" size="2xl"/> &nbsp; <span className="-mt-1"> Idea categories </span>
                    </h2>
                </ModalHeader>

                <ModalBody>
                    {/* Idea categories */}
                    <div className='text-[#6E6E6E] space-y-3 bg-[#efefef] py-2 rounded-xl w-full'>
                        {
                            categories.map((category)=>(
                                todayDate < new Date(category.closureDate.seconds*1000).toLocaleDateString() && (
                                    <NavLink to={{ pathname:'/share' }} state={{ sharecate: category }} >
                                        <div className='mb-2 hover:bg-gray-300 px-5 py-1 cursor-pointer transition duration-200 ease-out flex items-center justify-between'>
                                            <div className='space-y-0.5'>
                                                <h6 className='text-gray-700 text-md font-semibold'>{category.categoryName}</h6>
                                                <p className='text-gray-700 max-w-[250px] text-[13px] block truncate'>
                                                    {category.description}
                                                </p>
                                            </div>
                                        </div>
                                    </NavLink>
                                )
                            ))
                        }
                    </div>
                </ModalBody>

            </Modal>

            {/* Posts */}
            <div className="mt-5">
                    {
                        ideas.length === 0 ? (
                            <h1 className='w-full text-gray-700 ml-2'>Loading...</h1>
                        ) :
                        (
                            ideas.map((idea) => (
                                <Post
                                    key={idea.id}
                                    id={idea.id}
                                    idea={idea.data()}
                                />
                            ))
                        )
                    }
                    {   
                        ideas.length > 0 && (
                            <div className="text-center mt-3 mb-5">
                                <button class="relative inline-block text-md group focus:outline-none" onClick={fetchmore}>
                                    <span class="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
                                        <span class="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
                                        <span class="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
                                        <span class="relative">
                                            {
                                                empty ? (
                                                    "You are all caught up!"
                                                ) :(
                                                    "Load more..."
                                                )
                                            }
                                        </span>
                                    </span>
                                    <span class="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0" data-rounded="rounded-lg"></span>
                                </button>
                            </div>
                        )
                    } 
            </div>

            {/* Confirmation dialog */}
            <Modal size="medium" active={showModal2} toggler={() => setShowModal2(false)}>

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

        </div>
    )
}

export default Feed;
