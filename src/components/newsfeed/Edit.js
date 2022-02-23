import React, { useState, useEffect, Fragment, useRef } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { Avatar } from '@material-ui/core';
import Checkbox from '@material-tailwind/react/Checkbox';
import {
    CalendarIcon,
    PaperClipIcon,
    EmojiHappyIcon,
    PhotographIcon,
    XIcon,
    ArrowLeftIcon,
} from "@heroicons/react/outline";
import {
    InformationCircleIcon
} from "@heroicons/react/solid";
import Modal from "@material-tailwind/react/Modal";
import ModalHeader from "@material-tailwind/react/ModalHeader";
import ModalBody from "@material-tailwind/react/ModalBody";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import { useSelector } from 'react-redux'; //redux
import { selectUser } from '../../features/userSlice';
import { FileUploader } from "react-drag-drop-files";

// firebase
import {
    collection,
    doc,
    serverTimestamp,
    updateDoc,
    onSnapshot,
    query,
    where,
} from "firebase/firestore";

import { db, storage } from "../../config";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

// Toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// dummy data for visiblity status
const visibility = [
    { id: 1, name: 'Public' },
    { id: 2, name: 'Anonymous' },
]


function Edit({ id, categoryName, ideaText, image, document, categoryID }) {

    const navigate = useNavigate();
    
    const [ loading, setLoading ] = useState(false);

    const user = useSelector(selectUser);  // user
    const [ username, setUsername ] = useState([]);  // to display username from redux
    const [showdad, setShowdad] = useState(false); // drag and drop file show/hide
    const [file, setFile] = useState(null); // drag and drop
    const [ filename, setFilename ] = useState(null); // drag and drop file name
    const fileTypes = ["pdf"]; // Drag and Drop File types



    // input states
    const [ input, setInput ] = useState(ideaText); // idea text input
    const [ selectedVisibility, setSelectedVisiblity ] = useState(visibility[0]); // selectedVisiblity.name
    const filePickerRef = useRef(null); // file input ref (image)

    const [ showEmojis, setShowEmojis ] = useState(false); // for emoji
    const [selectedImage, setSelectedImage]=  useState(image); // for choosing image


    // user name display from redux + firestore
    useEffect(() =>{

        onSnapshot(
            query(collection(db, "generalStaff"), where("edubaseMail", "==", user.email)),
            (snapshot) => {
                setUsername(snapshot.docs.map((doc) => ({
                    ...doc.data(), id: doc.id
                })));
            }
        );

    }, [db]);


    // for file d&d
    const handleChange = (file) => {
        setFilename(file);
        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = (readerEvent) => {
            setFile(readerEvent.target.result);
        }   
    };


    // Emoji choose
    const addEmoji = (e) => {
        let sym = e.unified.split("-");
        let codesArray = [];
        sym.forEach((el) => codesArray.push("0x" + el));
        let emoji = String.fromCodePoint(...codesArray);
        setInput(input + emoji);
    };

    // Image choose
    const addImageToPost = (e) =>{
        const reader = new FileReader();
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
        }

        reader.onload = (readerEvent) => {
            setSelectedImage(readerEvent.target.result);
        };
    };

    // EDIT IDEA
    const editIdea = (e) => {
        
        e.preventDefault();

        // database reference
        const databaseRef = doc(db, 'idea', id);

        setLoading(true);

        updateDoc(databaseRef, {
            idea: input,
            ideaDate: serverTimestamp(),
            anonymousStatus: selectedVisibility.name,
        })
        .then(()=>{ 
            setLoading(false);
            toast.success("Your idea was updated", 
            { pauseOnHover:true }, navigate('/'));
            
        }).catch(() =>{
            toast.error("Error updating data", {
                pauseOnHover: true
            });
        });


        const imageRef = ref(storage, `idea/${id}/image`);
        const documentRef   = ref(storage, `idea/${id}/document`);

        // image upload to storage and update in collection
        if(selectedImage){

            uploadString(imageRef, selectedImage, "data_url").then(async()=>{
                const downloadURL = await getDownloadURL(imageRef);
                await updateDoc(doc(db, "idea", id), {
                    image: downloadURL,
                });  
            })
            .then(()=>{ 
                setLoading(false);
                navigate("/");
                
            }).catch(() =>{
                toast.error("Error updating data", {
                    pauseOnHover: true
                });
            });
        }

        // document uplaod to storage and update in collection
        if(file){
            uploadString(documentRef, file, "data_url").then(async()=>{
                const downloadURL = await getDownloadURL(documentRef);
                await updateDoc(doc(db, "idea", id), {
                    document: downloadURL,
                });  
            })
            .then(()=>{ 
                setLoading(false);
                navigate("/");
                
            }).catch(() =>{
                toast.error("Error updating data", {
                    pauseOnHover: true
                });
            });
        }
        

    }

    // Browse previous page
    const onPrevious = () => {
        navigate(-1);
    }


    return (
        <>
            <div className="flex-grow flex-[0.4] border-l border-r border-gray-300 max-w-2xl sm:ml-[73px] xl:ml-[350px] pb-36">
                <div className={`${loading && "opacity-60"}`}>

                    {/* header */}
                    <div className="flex shadow-sm items-center sm:justify-between py-3 px-3 sticky top-0 z-10 border-b bg-white border-gray-300">
                        <div className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0 mr-auto">
                            <div onClick={onPrevious} exact>
                                <ArrowLeftIcon className="h-5 text-gray-800" />
                            </div>
                        </div>
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 truncate">
                            Idea Edit
                        </h2>
                    </div>

                    {/* user info + visiblity */}
                    <div className="p-3 mt-3 flex space-x-3">

                        <Avatar className="w-20 h-20 rounded-full border border-gray-500 xl:mr-2.5 uppercase">
                            {user.email[0]}
                        </Avatar>

                        <div className='flex flex-col space-y-1'>
                            <div className='flex flex-row items-center'>
                                {
                                    username.map((uname) => (
                                        <h4 className='font-bold -mt-2 text-gray-800'>
                                            {uname.staffName}
                                        </h4>
                                    ))
                                }
                                <span className='text-sm -mt-2 ml-2 text-gray-600'>| &nbsp; {user.email}</span>
                            </div>

                            <div className="flex flex-row items-center">
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
                                            <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto bg-white 
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

                                <span className="ml-2 p-2 shadow-md rounded-md text-pink-600 text-sm">
                                    { categoryName }
                                </span>
                            
                            </div>
                        </div>
                    </div>

                    {/* textarea */}
                    <div className="w-full divide-y divide-gray-700 p-3 mt-1">
                        <textarea 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="bg-transparent outline-none text-[#353535] text-md placeholder-gray-500 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 tracking-wide w-full"
                            rows="3"
                            placeholder="What's your idea?"
                            spellCheck="false"
                        />                      
                    </div>

                    {
                        document && (
                            <div className="relative p-3 my-2">
                                <a href={document} target="_blank" rel="noreferrer" class="relative inline-flex items-center justify-start py-3 pl-4 pr-12 overflow-hidden font-semibold text-indigo-600 transition-all duration-150 ease-in-out rounded hover:pl-10 hover:pr-6 bg-[#efefef] group">
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
                    
                    {/* Image and for picked image */}
                    {
                        selectedImage && (
                            <div className='relative p-3'>
                                <div onClick={() => setSelectedImage(null)} className="absolute w-8 h-8 bg-[#b9b8b8] hover:bg-[#838282] rounded-full 
                                    flex items-center justify-center top-1 left-1 cursor-pointer transition transformduration-200 ease-out"
                                >
                                    <XIcon className="text-gray-600 h-6 hover:text-white" />
                                </div>
                                <img
                                    src={selectedImage}
                                    alt=""
                                    className="rounded-2xl max-h-80 object-contain"
                                />  
                            </div>  
                        )
                    }

                    {/* document choose (drag and drop) */}
                    {
                        showdad && (
                            <div className="relative p-3">
                                <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
                                <p className="text-sm mt-2 text-gray-500">{filename ? `File name: ${filename.name}` : "no files uploaded yet"}</p>
                            </div>
                        )
                    }

                    {/* Icons and button */}
                    <div className="flex items-center justify-between p-[5px] pr-3">
                        <div className="flex items-center">

                            {/* image choose icon */}
                            <div className="icon" onClick={() => filePickerRef.current.click()}>
                                <PhotographIcon className="text-[#1d9bf0] h-[22px]"/>
                                <input
                                    type="file"
                                    ref={filePickerRef}
                                    hidden
                                    onChange={addImageToPost}
                                />
                            </div>

                            {/* attached file */}
                            <div className="icon rotate-90">
                                <PaperClipIcon 
                                    className="text-[#1d9bf0] h-[22px]"
                                        onClick={() => {
                                        setShowdad(!showdad)
                                    }}
                                />
                            </div>

                            {/* Emoji icon */}
                            <div className="icon" onClick={() => setShowEmojis(!showEmojis)}>
                                <EmojiHappyIcon className="text-[#1d9bf0] h-[22px]" />
                            </div>

                            {/* Emoji picked */}
                            {
                                showEmojis && (
                                    <Picker
                                        onSelect={addEmoji}
                                        style={{
                                            position: "absolute",
                                            marginTop: "465px",
                                            maxWidth: "320px",
                                            borderRadius: "20px",
                                        }}
                                        theme="light"
                                    />
                                )
                            }

                        </div>

                        {/* post share button */}
                        <button 
                            onClick={editIdea}
                            className="bg-[#1d9bf0] text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-[#1a8cd8] disabled:bg-gray-300 disabled:cursor-default"
                            disabled={!input}
                        >
                            {
                                loading ? "Editing...." : "Edit"
                            }
                        </button>

                    </div>

                </div>
            </div>
        </>
    )
}

export default Edit