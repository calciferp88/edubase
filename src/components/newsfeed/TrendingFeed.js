import React, { useState, Fragment, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    ArrowLeftIcon,
} from "@heroicons/react/outline";
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import Button from '@material-tailwind/react/Button';
import { Listbox, Transition } from '@headlessui/react'
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
import TrendingPost from './TrendingPost';
// Toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



// dummy data for visiblity status
const visibility = [
    { id: 1, name: 'Newest' },
    { id: 2, name: 'Oldest' },
    { id: 3, name: 'Thumb up' },
    { id: 4, name: 'Thumb down' },
    { id: 5, name: 'View' },
    { id: 6, name: 'Comment' },
];

function TrendingFeed() {
    
    const navigate = useNavigate();
    const [ loading, setLoading ] = useState(false);
    const [ selectedVisibility, setSelectedVisiblity ] = useState(visibility[0]); // selectedVisiblity.name

    const [ ideas, setIdeas ] = useState([]); // newest ideas (default)

    // for default sorting
    useEffect(() => {
        
        onSnapshot(
            
            query(collection(db, "idea"), orderBy("ideaDate", "desc")),
                (snapshot) => {
                    setIdeas(snapshot.docs); // give ideas value
                }   
        )
        
    }, []);

    // sort idea
    const sortIdea = () => {
        if (selectedVisibility.name === 'Newest'){
            onSnapshot(
                
                query(collection(db, "idea"), orderBy("ideaDate", "desc")),
                    (snapshot) => {
                        setIdeas(snapshot.docs); // give ideas value
                    }   
                )
                toast.success("Showing newest Ideas", 
                { pauseOnHover:true });
        }

        if (selectedVisibility.name === 'Oldest'){
            onSnapshot(
                query(collection(db, "idea"), orderBy("ideaDate", "asc")),
                    (snapshot) => {
                        setIdeas(snapshot.docs); // give ideas value
                    }   
                )
                toast.success("Showing oldest Ideas", 
                { pauseOnHover:true });
        }

        if (selectedVisibility.name === 'Thumb up'){
            onSnapshot(
                query(collection(db, "idea"), orderBy("thumbupCount", "desc")),
                    (snapshot) => {
                        setIdeas(snapshot.docs); // give ideas value
                    }   
                )
                toast.success("Showing Ideas with most Thumb-ups", 
                { pauseOnHover:true });
        }

        if (selectedVisibility.name === 'Thumb down'){
            onSnapshot(
                query(collection(db, "idea"), orderBy("thumbdownCount", "desc")),
                    (snapshot) => {
                        setIdeas(snapshot.docs); // give ideas value
                    }   
                )
                toast.success("Showing Ideas with most Thumb-downs", 
                { pauseOnHover:true });
        }

        if (selectedVisibility.name === 'Comment'){
            onSnapshot(
                query(collection(db, "idea"), orderBy("commentCount", "desc")),
                    (snapshot) => {
                        setIdeas(snapshot.docs); // give ideas value
                    }   
                )
                toast.success("Showing most commented Ideas", 
                { pauseOnHover:true });
        }

        if (selectedVisibility.name === 'View'){
            onSnapshot(
                query(collection(db, "idea"), orderBy("viewCount", "desc")),
                    (snapshot) => {
                        setIdeas(snapshot.docs); // give ideas value
                    }   
                )
                toast.success("Showing most viewed Ideas", 
                { pauseOnHover:true });
        }


    }

    const onPrevious = () => {
        navigate(-1);
    }


    return (
    <>
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

            {/* header */}
            <div className="flex shadow-sm items-center sm:justify-between py-3 px-3 sticky top-0 z-10 border-b bg-white border-gray-300">
                <div className="flex items-center mr-auto">
                    <div className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0 ">
                        <div onClick={onPrevious}>
                            <ArrowLeftIcon className="h-5 text-gray-800" />
                        </div>
                    </div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mr-auto">
                        Explore
                    </h2>
                </div>

                <Listbox value={selectedVisibility} onChange={setSelectedVisiblity}>
                    <div className="relative">

                        <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 
                                                    focus-visible:ring-opacity-75 focus-visible:ring-white 
                                                    focus-visible:ring-offset-blue-300 focus-visible:ring-offset-2 
                                                    focus-visible:border-indigo-500 sm:text-sm"
                        >
                            <span className="block">{selectedVisibility.name}</span>
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
                            <Listbox.Options className="absolute w-[138px] py-1 mt-1 overflow-auto bg-white 
                                                        rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none text-sm
                                                        scrollbar-thin scrollbar-thumb-gray-300 ">
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
                                                    <span className={`${selected ? 'font-medium' : 'font-normal'}  text-sm`}>
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

                <Button
                    color="blue"
                    onClick={sortIdea}
                    ripple="light"
                    className="ml-3"
                >
                sort
                </Button>


            </div>

            {/* Ideas */}
            {
                ideas.length === 0 ? (
                    <h1 className='w-full text-gray-700 ml-2'>Loading...</h1>
                ) :
                (
                    ideas.map((idea) => (
                        <TrendingPost
                            key={idea.id}
                            id={idea.id}
                            idea={idea.data()}
                        />
                    ))
                )
            }
            

        </div>
    </>
  )
}

export default TrendingFeed