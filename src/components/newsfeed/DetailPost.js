import React, { useState, useEffect, Fragment } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Dialog, Transition, Listbox } from "@headlessui/react";
// truncate
import Truncate from 'react-truncate';

import {
    ChatIcon,
    DotsHorizontalIcon,
    ThumbUpIcon,
    ThumbDownIcon,
    XIcon,
    PhotographIcon,
    ChartBarIcon,
    EmojiHappyIcon,
    CalendarIcon,
    EyeIcon,
    MinusIcon,
} from "@heroicons/react/outline";
import {
    HeartIcon as HeartIconFilled,
    ChatIcon as ChatIconFilled,
    ThumbUpIcon as ThumbUpFiled,
    ThumbDownIcon as ThumbDownFilled,
    PencilIcon,
    TrashIcon,
    EyeIcon as EyeFilled,
    SelectorIcon,
    CheckIcon,
} from "@heroicons/react/solid";    
import Dropdown from '@material-tailwind/react/Dropdown';
import DropdownItem from '@material-tailwind/react/DropdownItem';
import { Avatar } from '@material-ui/core';
import Moment from "react-moment";
import {
    collection,
    doc,
    getDoc,
    updateDoc,
    onSnapshot,
    query,
    increment,
    where,
    deleteDoc,
    setDoc,
    addDoc,
    serverTimestamp,   
    orderBy,
} from "firebase/firestore";
import { db } from '../../config';
import { useSelector } from 'react-redux'; //redux
import { selectUser } from '../../features/userSlice';


// Toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import Modal from "@material-tailwind/react/Modal";
import ModalHeader from "@material-tailwind/react/ModalHeader";
import ModalBody from "@material-tailwind/react/ModalBody";
import ModalFooter from "@material-tailwind/react/ModalFooter";
import Button from '@material-tailwind/react/Button';
import Icon from '@material-tailwind/react/Icon';

// dummy data for visiblity status
const visibility = [
    { id: 1, name: 'Public' },
    { id: 2, name: 'Anonymous' },
]


function DetailPost({idea, id, staffEmail}) {

    const navigate = useNavigate();
    const user = useSelector(selectUser);  // user from redux

    const [ categories, setCategories] = useState([]);

    // const [ authorEmail, setAuthoremail ] = useState(null);

    const [ loading, setLoading ] = useState(false); // for loading state
    const [ username, setUsername ] = useState([]);  // to display username
    const [ delid, setDelid ] = useState(null); // to set Idea id for Deleteing Idea
    const [ showModal1, setShowModal1] = useState(false); //confirmation dialog for Deleting Idea


    const [ cmtid, setCmtid ] = useState(null); // to set Idea id for comment modal box
    const [ isOpen, setIsOpen] =  useState(false); // to show and close coment modalbox 
    const [ comment, setComment ] = useState(""); // comment inputbox

    const [ thumbedup, setThumbedup ] = useState(false); // to check post is thumbedup or not
    const [ thumbeddown, setThumbeddown ] = useState(false); // to check post is thumbed down or not
    const [ viewed, setViewed ] = useState(false); // to check post is viewed or not

    const [ thumbups, setThumbups ] = useState([]); // to count thumbup amount
    const [ thumbdowns, setThumbdowns ] = useState([]); // to count thumbdown amount
    const [ comments, setComments ] = useState([]); // to count comment amount
    const [ views, setViews ] = useState([]); // to count view amount
    const [ selectedVisibility, setSelectedVisiblity ] = useState(visibility[0]); // selectedVisiblity.name


    // Display author name---------

    useEffect(() => {

        const sidea = idea.staffEmail;

        if(sidea)
        {
            onSnapshot(
                query(collection(db, "generalStaff"), where("edubaseMail", "==", sidea )),
                (snapshot) => {
                    setUsername(snapshot.docs.map((doc) => ({
                        ...doc.data(), id: doc.id
                    })));
                }
            );
        }

    }, [idea]);


    // ---------------------------- Dislay category dates  ------------------------------

    useEffect(() => {

        const icategoryName = idea.categoryName;
        if(icategoryName){
            onSnapshot(
                query(collection(db, "category"), where("categoryName", "==", icategoryName)),
                (snapshot) => {
                    setCategories(snapshot.docs.map((doc) => ({
                        ...doc.data(), id: doc.id
                    })));
                }
            )
        }

    }, [idea]);



    // ---------------------------- Delete Idea ------------------------------

    const onDelete = (id) => {
        const data = doc(db, 'idea', id);

        deleteDoc(data).then(()=>{
            toast.error("Your Idea was deleted", 
            { pauseOnHover:true }, navigate('/'));
            setShowModal1(false);
        
        }).catch(() =>{
            toast.error("Error deleting data", {
                pauseOnHover: true
            });
        });
    }

    // ---------------------------- View functions ------------------------------


    // to retrieve views amount
    useEffect(() => {
        onSnapshot(collection(db, "idea", id, "view"), (snapshot) => (
            setViews(snapshot.docs)
        ))
    }, [db, id]);


    // to retrieve user viewed or not
    useEffect(() => {
        setViewed(
            views.findIndex((view) => view.id === user.uid ) !== -1
        )
    }, [views]);


    


    // ----------------------------- Thumb Ups functions --------------------------


    // give thumbup to idea 
    const thumbupIdea = async () => {
        if(thumbedup) {
            await deleteDoc(doc(db, "idea", id, "thumbUp", user.uid ));

            const decrement_no = increment(-1);

            await updateDoc(doc(db, "idea", id ), {
                thumbupCount : decrement_no,
            });
        }
        else{
            await setDoc(doc(db, "idea", id, "thumbUp", user.uid ), {
                staffEmail : idea.staffEmail,
            });

            const increment_no = increment(1);
            const decrement_no = increment(-1);

            await updateDoc(doc(db, "idea", id ), {
                thumbupCount : increment_no,
            });

            await deleteDoc(doc(db, "idea", id, "thumbDown", user.uid ));

            if(thumbeddown){
                await updateDoc(doc(db, "idea", id ), {
                    thumbdownCount : decrement_no,
                });
            }
        }
    }


    // to retrieve thumbups amount
    useEffect(() => {
        onSnapshot(collection(db, "idea", id, "thumbUp"), (snapshot) => (
            setThumbups(snapshot.docs)
        ))
    }, [db]);


    // to retrieve user is thumbedup or not
    useEffect(() => {
        setThumbedup(
            thumbups.findIndex((thumbup) => thumbup.id === user.uid ) !== -1
        )
    }, [thumbups]);


    // ----------------------------- Thumb Downs functions --------------------------

    // give thumbdown to idea 
    const thumbdownIdea = async () => {
        if(thumbeddown) {
            await deleteDoc(doc(db, "idea", id, "thumbDown", user.uid ));

            const decrement_no = increment(-1);

            await updateDoc(doc(db, "idea", id ), {
                thumbdownCount : decrement_no,
            });
        }
        else{
            await setDoc(doc(db, "idea", id, "thumbDown", user.uid ), {
                staffEmail : idea.staffEmail,
            });

            const increment_no = increment(1);
            const decrement_no = increment(-1);

            await updateDoc(doc(db, "idea", id ), {
                thumbdownCount : increment_no,
            });

            await deleteDoc(doc(db, "idea", id, "thumbUp", user.uid ));

            if(thumbedup)
            {
                await updateDoc(doc(db, "idea", id ), {
                    thumbupCount : decrement_no,
                });
            }

        }
    }

    // to retrieve thumbdowns amount
    useEffect(() => {
        onSnapshot(collection(db, "idea", id, "thumbDown"), (snapshot) => (
            setThumbdowns(snapshot.docs)
        ))
    }, [db]);

    // to retrieve user is thumbeddown or not
    useEffect(() => {
        setThumbeddown(
            thumbdowns.findIndex((thumbdown) => thumbdown.id === user.uid ) !== -1
        )
    }, [thumbdowns]);

    // ---------------------------- Giev comment to Idea -----------------------------
    const sendComment= async (e) => {
        e.preventDefault();
        setLoading(true);
        await addDoc(collection(db, "idea", cmtid, "comments"), {
            comment: comment,
            commenterEmail : user.email,
            commenterId: user.uid,
            anonymousStatus: selectedVisibility.name,
            timestamp: serverTimestamp(),
        });
        const increment_no = increment(1);

        await updateDoc(doc(db, "idea", id ), {
            commentCount : increment_no,
        });

        await addDoc(collection(db, "notification"), {
            authorEmail : idea.staffEmail,
            commenterEmail : user.email,
            status: 0, // unseen status
            type : 0, // for author and commenter
            ideaID : cmtid, //for link
            timestamp: serverTimestamp(),
        });

        setLoading(false);
        setIsOpen(false);
        toast.success("Replied your comment", 
        { pauseOnHover:true });
        setComment("");
    }

    // to count comment amount
    useEffect(() => {
        onSnapshot(
            query(
                collection(db, "idea", id, "comments"),
                orderBy("timestamp", "desc")
            ),
            (snapshot) => setComments(snapshot.docs)
        )
    }, [db]);

    // For closure dates
    const dateObj = new Date();
    const month = dateObj.getUTCMonth() + 1; //months from 1-12
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();
    
    const todayDate = month + "/" + day + "/" + year;


    return (

        <>
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


            {/* post */}
            <div className="p-3 flex cursor-pointer border-b border-gray-300">
                <div className='flex flex-col space-y-5 w-full'>

                    {/* user info */}
                    <div className='flex justify-between'>

                        {/* user image */}
                        {
                            idea?.anonymousStatus === "Public" ? (
                                <Avatar className="h-11 w-11 rounded-full mr-4 border border-gray-500 uppercase">
                                    {idea?.staffEmail[0]}
                                </Avatar>
                            ) : (
                                <Avatar className="h-11 w-11 rounded-full mr-4 border border-gray-300 uppercase">
                                    A
                                </Avatar>
                            )
                            
                        }

                        {/* username and tag */}
                        <div className="text-gray-800">

                            <div className='inline-block group'>
                                

                                {
                                    username.length > 0 && (
                                        idea.anonymousStatus === "Public" ?  (
                                            username.map((uname) => (
                                                <h4 className='font-bold text-[15px] sm:text-base text-gray-600 group-hover:underline'>
                                                    {uname.staffName}
                                                </h4>
                                            ))
                                        ) : (
                                            <h4 className='font-bold text-[15px] sm:text-base text-gray-600 group-hover:underline'>
                                                Anonymous
                                            </h4>
                                        )
                                    )
                                    
                                }

                                {
                                    idea.anonymousStatus === "Public" ? (
                                        <span className='text-sm sm:text-[15px] mr-1'>
                                            {idea.staffEmail}
                                        </span>
                                    ) : (
                                        <span className='text-sm sm:text-[15px] mr-1'>
                                            anonymous@edubase.edu
                                        </span>
                                    )
                                }

                            </div>
                            .{" "}
                            <span className='hover:underline text-sm sm:text-[15px]'>
                                <Moment fromNow className="pr-2 text-xs">
                                    {idea?.ideaDate?.toDate()}
                                </Moment>
                            </span>
                            .{" "}
                            <NavLink to="/">
                                <span className='text-pink-400 font-bold text-sm hover:underline'>
                                    {idea?.categoryName}
                                </span>
                            </NavLink>

                        </div>

                        {/* Dots icon */}
                        {
                            categories.map((category) => (
                                todayDate < new Date(category?.finalClosureDate?.seconds*1000).toLocaleDateString() ? (

                                    user.email === idea?.staffEmail ?  (
                                        <div className='icon group flex-shrink-0 ml-auto'>
                                            <Dropdown
                                                color="transparent"
                                                buttonText={
                                                    <>
                                                        <DotsHorizontalIcon className='h-5 -mr-5 text-gray-600 group-hover:text-gray-500' />
                                                    </>
                                                }
                                                rounded
                                                style={{
                                                    padding: 0,
                                                    color: 'transparent',
                                                }}
                                            >
                                                <DropdownItem color="lightBlue">
                                                    <NavLink to={{ pathname:'/edit' }} state={{ editidea: idea, id : id }} className='flex'>
                                                        <PencilIcon className='h-5 mr-2'/> Edit idea
                                                    </NavLink>
                                                </DropdownItem>
                                                <DropdownItem color="lightBlue">
                                                    <div 
                                                    onClick={() => {
                                                        setShowModal1(true)
                                                        setDelid(id)
                                                    }}
                                                    className='flex'>
                                                        <TrashIcon className='h-5 mr-2'/> Delete idea
                                                    </div>
                                                </DropdownItem>
                                            </Dropdown>
                                        </div>
                                    ) : (
                                        <div className='flex-shrink-0 ml-auto'>
                                            {" "}
                                        </div>
                                    )

                                ) : (
                                    
                                    <div className='flex-shrink-0 ml-auto'>
                                        {" "}
                                    </div>
                                )
                            ))
                            
                        }
                        
                    </div>

                    {/* caption and Image */}
                    <p className='text-gray-700 text-lg selection:bg-black selection:text-white'>
                        { idea.idea }
                    </p>

                    {
                        idea?.document && (
                            <div className="my-5">
                                <a href={idea?.document} target="_blank" rel="noreferrer" class="relative inline-flex items-center justify-start py-3 pl-4 pr-12 overflow-hidden font-semibold text-indigo-600 transition-all duration-150 ease-in-out rounded hover:pl-10 hover:pr-6 bg-[#efefef] group">
                                    <span class="absolute bottom-0 left-0 w-full h-1 transition-all duration-150 ease-in-out bg-indigo-600 group-hover:h-full"></span>
                                    <span class="absolute right-0 pr-4 duration-200 ease-out group-hover:translate-x-12">
                                        <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                    </span>
                                    <span class="absolute left-0 pl-2.5 -translate-x-12 group-hover:translate-x-0 ease-out duration-200">
                                        <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                    </span>
                                    <span class="relative w-full text-left transition-colors duration-200 ease-in-out group-hover:text-white">View Document</span>
                                </a>
                            </div>
                        )
                    }

                    {
                        idea?.image && (
                            <img
                                src={ idea?.image }
                                alt=""
                                className='rounded-2xl max-h-[700px] object-cover mr-2'
                            />
                        )
                    }

                    {/* Icons */}
                    <div className='text-gray-700 flex justify-between w-10/12 mx-auto'>

                        {/* thumb up */}
                        
                        <div 
                        onClick={(e) => {
                            e.stopPropagation();
                            thumbupIdea();
                        }}
                        className='flex items-center space-x-1 group'
                        >
                            <div className='icon'>
                                {
                                    thumbedup ? (
                                        <ThumbUpFiled className='h-6 text-blue-700 hover:scale-125 transition-all duration-150 group-hover:text-blue-800' />
                                    ) : (
                                        <ThumbUpIcon className='h-6 hover:scale-125 transition-all duration-150 group-hover:text-blue-700' />
                                    )
                                }
                            </div>
                            <span className='group-hover:text-blue-600 text-sm'>
                                {thumbups.length}
                            </span>
                        </div>

                        {/* thumb down */}
                        <div 
                        onClick={(e) => {
                            e.stopPropagation();
                            thumbdownIdea();
                        }}
                        className='flex items-center space-x-1 group'>
                            <div className='icon group-hover:bg-pink-600/10'>
                                {
                                    thumbeddown ? (
                                        <ThumbDownFilled className='h-6 text-pink-700 hover:scale-125 transition-all duration-150 group-hover:text-pink-800' />
                                    ) : (
                                        <ThumbDownIcon className='h-6 hover:scale-125 transition-all duration-150 group-hover:text-pink-700' />
                                    )
                                }
                            </div>
                            <span className='group-hover:text-pink-600 text-sm'>
                                {thumbdowns.length}
                            </span>
                        </div>

                        {/* comment */}
                        {
                            categories.map((category) => (
                                todayDate < new Date(category?.finalClosureDate?.seconds*1000).toLocaleDateString() ? (
                                    <div 
                                        onClick={() => {
                                            setCmtid(id)
                                            setIsOpen(true)
                                        }}
                                        className='flex items-center space-x-1 group'
                                        >
                                            <div className='icon group-hover:bg-gray-500 group-hover:bg-opacity-10'>
                                                <ChatIcon className='h-6 group-hover:text-gray-500'/>
                                            </div>
                                            {
                                                comments.length > 0 ? (
                                                    <span className='group-hover:text-gray-500 text-sm'>
                                                        {comments.length}
                                                    </span>
                                                ) : (
                                                    <span className='group-hover:text-gray-500 text-sm'>
                                                        0
                                                    </span>
                                                )
                                            }
                                    </div> 
                                ) : (
                                    <div className='flex items-center space-x-1 group'>
                                        <div className='icon group-hover:bg-red-700 group-hover:bg-opacity-20 relative'>
                                            <ChatIcon className='h-6'/>
                                            <MinusIcon className="h-7 absolute -rotate-45" />
                                        </div>
                                        {   
                                            comments.length > 0 ? (
                                                <span className='group-hover:text-gray-500 text-sm'>
                                                    {comments.length}
                                                </span>
                                            ) : (
                                                <span className='group-hover:text-gray-500 text-sm'>
                                                    0
                                                </span>
                                            )
                                        }
                                    </div>
                                )
                            ))
                        }
                        


                        {/* View icon */}
                        <div className='flex items-center space-x-1 group'>
                            <div className='icon group-hover:bg-gray-500 group-hover:bg-opacity-10'>
                                {
                                    viewed ? (
                                        <EyeFilled className='h-6 group-hover:text-gray-500'/>
                                    ) : (
                                        <EyeIcon className='h-6 group-hover:text-gray-500' />
                                    )
                                }
                            </div>
                            {
                                views.length > 0 ? (
                                    <span className='group-hover:text-gray-500 text-sm'>
                                        {views.length}
                                    </span>
                                ) : (
                                    <span className='group-hover:text-gray-500 text-sm'>
                                        0
                                    </span>
                                )
                            }
                        </div>

                    </div>


                </div>
            </div>

            {/* cmt modal */}
            <Transition.Root show={isOpen} as={Fragment}>
                <Dialog as="div" className="fixed z-50 inset-0 pt-8" onClose={setIsOpen} >
                    <div className="flex items-start justify-center min-h-[800px] sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-[#5b7083] bg-opacity-40 transition-opacity" />
                        </Transition.Child>

                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            
                            <div className='inline-block align-bottom bg-[#f4f4f4] rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full'>
                                
                                <div className='flex items-center px-1.5 py-2 border-b border-gray-300'>
                                    <div onClick={() => setIsOpen(false)} className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0" >
                                        <XIcon className='h-[22px] text-gray-500' />
                                    </div>
                                </div>

                                <div className='flex px-4 pt-5 pb-2.5 sm:px-6'>

                                    <div className='w-full'>
                                        <div className='text-[#556166] flex gap-x-3 relative'>
                                            <span className='w-0.5 h-full z-[-1] absolute left-5 top-11 bg-gray-300'/>
                                            {
                                                idea.anonymousStatus === "Public" ? (
                                                    <Avatar className="h-11 w-11 rounded-full mr-4 border border-gray-500 uppercase">
                                                        {idea.staffEmail[0]}
                                                    </Avatar>
                                                ) : (
                                                    <Avatar className="h-11 w-11 rounded-full mr-4 border border-gray-300 uppercase">
                                                        A
                                                    </Avatar>
                                                )
                                                
                                            }

                                            <div>

                                                <div className='inline-block group'>

                                                    {
                                                        idea.anonymousStatus === "Public" ?  (
                                                            username.map((uname) => (
                                                                <h4 className='font-bold text-[#363636] inline-block text-[15px] sm:text-base'>
                                                                    {uname.staffName}
                                                                </h4>
                                                            ))
                                                        ) : (
                                                            <h4 className='font-bold text-[#363636] inline-block text-[15px] sm:text-base'>
                                                                Anonymous
                                                            </h4>
                                                        )
                                                        
                                                    }
                                                    {
                                                        idea.anonymousStatus === "Public" ? (
                                                            <span className='ml-1.5 text-sm sm:text-[15px]'>
                                                                {idea.staffEmail}{" "}
                                                            </span>
                                                        ) : (
                                                            <span className='ml-1.5 text-sm sm:text-[15px]'>
                                                                anonymous@edubase.edu{" "}
                                                            </span>
                                                        )
                                                    }
                                                    
                                                </div>{" "}
                                                .{" "}
                                                <span className='hover:underline text-sm sm:text-[15px]'>
                                                    <Moment fromNow>{idea?.ideaDate?.toDate()}</Moment>
                                                </span>
                                                <p className='text-[#5c5c5c] text-[15px] sm:text-base'>
                                                    <Truncate lines={2}>
                                                        { idea.idea }
                                                    </Truncate> 
                                                </p>
                                            </div>
                                        </div>

                                        <div className='mt-7 flex space-x-3 w-full'>
                                        <Avatar className="w-11 h-11 rounded-full border border-gray-500 uppercase">
                                            {user.email[0]}
                                        </Avatar>
                                        <div className="flex-grow mt-2">

                                            <textarea
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                placeholder="reply your comment"
                                                rows="2"
                                                className="ml-3 bg-transparent outline-none text-[#414141] text-md placeholder-gray-500 tracking-wide w-full min-h-[80px]"
                                            />

                                            <div className="flex items-center justify-between pt-2.5">
                                                <div className='flex items-center'>
                                                    
                                                    <Listbox value={selectedVisibility} onChange={setSelectedVisiblity}>
                                                        <div className="relative">

                                                            <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 
                                                                                        focus-visible:ring-opacity-75 focus-visible:ring-white 
                                                                                        focus-visible:ring-offset-blue-300 focus-visible:ring-offset-2 
                                                                                        focus-visible:border-indigo-500 sm:text-sm"
                                                            >
                                                                <span className="block truncate">{selectedVisibility.name}</span>
                                                                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                                                <SelectorIcon
                                                                    className="w-5 h-5 text-gray-400"
                                                                    aria-hidden="true"
                                                                />
                                                                </span>
                                                            </Listbox.Button>

                                                            <Transition
                                                                as={Fragment}
                                                                leave="transition ease-in duration-100"
                                                                leaveFrom="opacity-100"
                                                                leaveTo="opacity-0"
                                                            >
                                                                <Listbox.Options className="z-50 w-full py-1 mt-1 overflow-auto bg-white 
                                                                                            rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none text-sm
                                                                                            scrollbar-thin scrollbar-thumb-gray-300">
                                                                    {
                                                                        visibility.map((visib, visibIdx) => (
                                                                            <Listbox.Option
                                                                                key={visibIdx}
                                                                                className={({ active }) =>
                                                                                    `${active ? 'text-[#1d9bf0] bg-amber-100' : 'text-gray-900'}
                                                                                        cursor-default select-none relative py-2 pl-10 pr-4`
                                                                                }
                                                                                value={visib}
                                                                            >
                                                                                {({ selected, active }) => (
                                                                                    <>
                                                                                        <span className={`${selected ? 'font-medium' : 'font-normal'} block text-sm truncate`}>
                                                                                            {visib.name}
                                                                                        </span>
                                                                                        {selected ? (
                                                                                            <span className={`${ active ? 'text-[#1d9bf0]' : 'text-[#1d9bf0]'} absolute inset-y-0 left-0 flex items-center pl-3`}>
                                                                                                <CheckIcon className="w-5 h-5" aria-hidden="true" />
                                                                                            </span>
                                                                                        ) : null}
                                                                                    </>
                                                                                )}
                                                                            </Listbox.Option>
                                                                        ))
                                                                    }
                                                                </Listbox.Options>
                                                            </Transition>

                                                        </div>
                                                    </Listbox>

                                                    <div className="icon">
                                                        <PhotographIcon className="text-[#1d9bf0] h-[22px]" />
                                                    </div>

                                                    <div className="icon rotate-90">
                                                        <ChartBarIcon className="text-[#1d9bf0] h-[22px]" />
                                                    </div>

                                                    <div className="icon">
                                                        <EmojiHappyIcon className="text-[#1d9bf0] h-[22px]" />
                                                    </div>

                                                    <div className="icon">
                                                        <CalendarIcon className="text-[#1d9bf0] h-[22px]" />
                                                    </div>
                                                </div>
                                                <button
                                                    className="bg-[#1d9bf0] text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-[#1a8cd8] disabled:hover:bg-gray-500 disabled:bg-gray-300 disabled:cursor-default"
                                                    type="submit"
                                                    onClick={sendComment}
                                                    disabled={!comment.trim()}
                                                >
                                                    {
                                                        loading ? "Replying..." : "Reply"
                                                    }
                                                </button>
                                                
                                            </div> 

                                        </div>
                                    </div>


                                    </div>
                                    
                                </div>

                            </div>


                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            {/* Deleting confirmation Dialog */}
            <Modal size="medium" active={showModal1} toggler={() => setShowModal1(false)}>

                <ModalHeader toggler={() => setShowModal1(false)}>
                    <h2 className="flex item-center text-red-500">
                        <Icon name="light" size="2xl"/> &nbsp; <span className="-mt-1"> Delete Idea </span>
                    </h2>
                </ModalHeader>

                <ModalBody>
                    <p>Are you sure <br/>
                    you want to delete the idea?</p>
                </ModalBody>

                <ModalFooter>
                    <Button 
                        color="blue"
                        onClick={(e) => setShowModal1(false)}
                        ripple="dark"
                    >
                        Cancel
                    </Button>

                    <Button
                        color="red"
                        onClick={() => onDelete(delid)}
                        ripple="light"
                    >
                        Delete
                    </Button>
                </ModalFooter>
            </Modal>


        </>
    )
}

export default DetailPost;
