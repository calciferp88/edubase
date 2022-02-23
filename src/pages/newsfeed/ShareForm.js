import React, {useState, useEffect, useRef, Fragment} from 'react';
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
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import { useSelector } from 'react-redux'; //redux
import { selectUser } from '../../features/userSlice';
import { FileUploader } from "react-drag-drop-files";

// firebase
import {
    addDoc,
    collection,
    doc,
    serverTimestamp,
    updateDoc,
    onSnapshot,
    getDoc,
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

function ShareForm({ categoryid, categoryname, closureDate, finalClosuredate }) {

    const navigate = useNavigate();
    const fileTypes = ["pdf"]; // File types
    const [checked, setChecked] = useState(false); // Terms and condition checkbox
    const [showModal, setShowModal] = useState(false); // Term and condition modal
    const [ showModal1, setShowModal1 ] = useState(false); // Closure Dates display

    const user = useSelector(selectUser);  // user
    const [ username, setUsername ] = useState([]);  // to display username from redux

    const [showdad, setShowdad] = useState(false); // drag and drop file show/hide
    const [ loading, setLoading ] = useState(false); // loading status
    const [ showEmojis, setShowEmojis ] = useState(false); // for emoji
    const [selectedImage, setSelectedImage]=  useState(null); // for image upload
    const [file, setFile] = useState(null); // drag and drop
    const [ filename, setFilename ] = useState(null); // drag and drop file name


    // input states
    const [ input, setInput ] = useState(""); // idea text input
    const [ selectedVisibility, setSelectedVisiblity ] = useState(visibility[0]); // selectedVisiblity.name
    const filePickerRef = useRef(null); // file input ref (image)


    // Terms and condition handleChange
    const handleChangeT = (e) => {
        setChecked(e.target.checked);
        setShowModal(true);
    }  

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


    // for file d&d
    const handleChange = (file) => {
        setFilename(file);
        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = (readerEvent) => {
            setFile(readerEvent.target.result);
        }   
    };


    // SHARE IDEA
    const shareIdea = async() =>  {
        setLoading(true);

        // firstly add to idea collection
        const docRef = await addDoc(collection(db,'idea'),{
            idea: input,
            ideaDate: serverTimestamp(),
            anonymousStatus: selectedVisibility.name,
            staffID: user.uid,
            staffEmail: user.email,
            categoryID: categoryid,
            categoryName: categoryname,
            thumbupCount: 0,
            thumbdownCount: 0,
            viewCount: 0,
            commentCount: 0,
            ideaStatus: false,
        });

        // image and document refs
        const imageRef = ref(storage, `idea/${docRef.id}/image`);
        const documentRef   = ref(storage, `idea/${docRef.id}/document`);


        // image upload to storage and update in collection
        if(selectedImage){
            await uploadString(imageRef, selectedImage, "data_url").then(async()=>{
                const downloadURL = await getDownloadURL(imageRef);
                await updateDoc(doc(db, "idea", docRef.id), {
                    image: downloadURL,
                });  
            });
        }

        // document uplaod to storage and update in collection
        if(file){
            await uploadString(documentRef, file, "data_url").then(async()=>{
                const downloadURL = await getDownloadURL(documentRef);
                await updateDoc(doc(db, "idea", docRef.id), {
                    document: downloadURL,
                });  
            });
        }

        setLoading(false);
        toast.success("Your idea was shared", 
        { pauseOnHover:true }, navigate('/'));
        setInput("");
        setSelectedImage("");

    }


    const onPrevious = () => {
        navigate(-1);
    }


    return (
        <div className="flex-grow flex-[0.4] border-l border-r border-gray-300 max-w-2xl sm:ml-[73px] xl:ml-[350px]">
            
            <div className={`${loading && "opacity-60"}`}>


                {/* header */}
                <div className="flex shadow-sm items-center sm:justify-between py-3 px-3 sticky z-10 top-0 border-b bg-white border-gray-300">
                    <div className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0 mr-auto">
                        <div onClick={onPrevious} exact>
                            <ArrowLeftIcon className="h-5 text-gray-800" />
                        </div>
                    </div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-700">Share your idea</h2>
                </div>

                {/* user info + visiblity */}
                <div className="p-3 mt-3 flex space-x-3">
                    
                    <Avatar className="w-20 h-20 rounded-full bg-red-700 border border-gray-500 xl:mr-2.5 uppercase">
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
                                { categoryname }
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

                {/* Agree Terms and condition */}
                <div className='w-full p-3 my-2'>
                    <Checkbox
                        color="lightBlue"
                        text="Agree Terms and condition"
                        checked={checked}
                        onChange={handleChangeT}
                        id="checkbox"
                    />
                </div>
                
                
                {/* Picked image */}
                {
                    selectedImage && (
                        <div className="relative p-3">
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

                        <div className="icon" onClick={() => setShowEmojis(!showEmojis)}>
                            <EmojiHappyIcon className="text-[#1d9bf0] h-[22px]" />
                        </div>

                        <div className="icon">
                            <CalendarIcon 
                                className="text-[#1d9bf0] h-[22px]"
                                onClick={() => {
                                    setShowModal1(true)
                                }}
                            />
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
                        onClick={shareIdea}
                        className="bg-[#1d9bf0] text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-[#1a8cd8] disabled:bg-gray-300 disabled:cursor-default"
                        disabled={!checked || !input}
                    >
                        {
                            loading ? "Sharing..." : "Share"
                        }
                    </button>

                </div>


                {/* Terms and condition dialog */}
                <Modal size="medium" active={showModal} toggler={() => setShowModal(false)}>

                    <ModalHeader toggler={() => setShowModal(false)}>
                        <h2 className="flex item-center text-gray-700">
                            <InformationCircleIcon className='h-7' /><span className="ml-1 -mt-1"> Terms and Condition </span>
                        </h2>
                    </ModalHeader>

                    <ModalBody>
                        <div className="mx-2">
                            <p className=''><strong>Terms and Conditions</strong></p>
                            <p className=''>Our Terms and Conditions were last updated on 2022 April, 27.</p>
                            <p className='mb-3'>Please read these terms and conditions carefully before using Edubase Website.</p>

                            <p className=''><strong>Interpretation and Definitions</strong></p>
                            <p className=''><strong>Interpretation</strong></p>
                            <p className='mb-3'>The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>
                            
                            <p className=''><strong>Definitions</strong></p>
                            <p className='mb-3'>For the purposes of these Terms and Conditions:</p>
                            <ul>
                                <li className='mb-1'>
                                    <p><strong>"Affiliate"</strong> means an entity that controls, is controlled by or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.</p>
                                </li>
                                <li className='mb-1'>
                                    <p><strong>"Account"</strong> means a unique account created for You to access our private portal.</p>
                                </li>
                                <li className='mb-1'>
                                    <p><strong>"Company"</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to EDUBASE.</p>
                                </li>
                                <li className='mb-1'>
                                    <p><strong>"Country"</strong> refers to United Kingdom </p>
                                </li>
                                <li className='mb-1'>
                                    <p><strong>"Content"</strong> refers to content such as text, images, or other information that can be posted, uploaded, linked to or otherwise made available by You, regardless of the form of that content.</p>
                                </li>
                            </ul>
                        </div>
                        
                    </ModalBody>
                </Modal>

                {/* Closure Dates Dialog */}
                <Modal size="medium" active={showModal1} toggler={() => setShowModal1(false)}>

                    <ModalHeader toggler={() => setShowModal1(false)}>
                        <h3 className="flex item-center text-gray-700 mt-3">
                            <CalendarIcon className='h-6' /><span className="ml-1 -mt-1"> Category Closure Dates </span>
                        </h3>
                    </ModalHeader>

                    <ModalBody>
                        <div className="mx-1 mt-2">
                            <p className='flex mb-3 text-gray-700'>
                                <span className='w-[200px] mr-1 font-bold'>Sharing closure date</span>
                                <span>: {closureDate}</span>
                            </p>
                            <p className='flex text-gray-700'>
                                <span className='w-[200px] mr-1 font-bold'>Commenting closure date</span>
                                <span>: {finalClosuredate}</span>
                            </p>
                        </div>
                    </ModalBody>
                </Modal>


            </div>


        </div>
    );
}

export default ShareForm;
