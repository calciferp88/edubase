import React,{ useState, useEffect, Fragment, useRef} from 'react';
import ReactToPrint from 'react-to-print';
import { NavLink } from 'react-router-dom';
import Icon from '@material-tailwind/react/Icon';

import {
    PrinterIcon
} from "@heroicons/react/outline";
import { Dialog, Transition, Listbox } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import Card from '@material-tailwind/react/Card';
import CardHeader from '@material-tailwind/react/CardHeader';
import CardBody from '@material-tailwind/react/CardBody';
import Button from '@material-tailwind/react/Button';

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
    where
} from 'firebase/firestore';
import { db } from '../../config';
// Toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Modal from "@material-tailwind/react/Modal";
import ModalHeader from "@material-tailwind/react/ModalHeader";
import ModalBody from "@material-tailwind/react/ModalBody";
import ModalFooter from "@material-tailwind/react/ModalFooter";


// dummy data for visiblity status
const visibility = [
    { id: 0, name: 'Filter Data' },
    { id: 1, name: 'Ideas without comment' },
    { id: 2, name: 'Anonymous ideas' },
];

function ExceptionReport() {

    const componentRef = useRef(); // for print
    const [showModal, setShowModal] = useState(false); // add modal
    const [ selectedVisibility, setSelectedVisiblity ] = useState(visibility[0]); // selectedVisiblity.name
    const [ filtered, setFiltered ] = useState(false);
    const [ nocmtideas, setNocmtideas] = useState([]);
    const [ ideaid, setIdeaid ] = useState(""); // for set id
    const [comments, setComments ] = useState([]); // comments



    // reterive and display ideas with no comments
    useEffect(() =>{
        onSnapshot(
        query(collection(db, "idea"), orderBy("ideaDate", "desc"), where("commentCount", "==", 0)),
            (snapshot) => {
                setNocmtideas(snapshot.docs.map((doc) => ({
                    ...doc.data(), id: doc.id
                })));
            }   
        )
    }, [db]);

    // filter
    const filter = () =>{

        if (selectedVisibility.name === 'Ideas without comment'){

            onSnapshot(
                query(collection(db, "idea"), orderBy("ideaDate", "desc"), where("commentCount", "==", 0)),
                    (snapshot) => {
                        setNocmtideas(snapshot.docs.map((doc) => ({
                        ...doc.data(), id: doc.id
                    })));
                }   
            )
            toast.success("Showing Ideas without comments", 
            { pauseOnHover:true });
        }

        if (selectedVisibility.name === 'Anonymous ideas'){
            setFiltered(true);
            onSnapshot(
                query(collection(db, "idea"), orderBy("ideaDate", "desc"), where("anonymousStatus", "==", "Anonymous")),
                    (snapshot) => {
                        setNocmtideas(snapshot.docs.map((doc) => ({
                        ...doc.data(), id: doc.id
                    })));
                }   
            )
            toast.success("Showing Anonymous Ideas", 
            { pauseOnHover:true });
        }
        
    }


    // comments
    useEffect(() => {
        if(ideaid){
            onSnapshot(
                query(
                    collection(db, "idea", ideaid, "comments"),
                    where("anonymousStatus", "==", "Anonymous"),
                ),
                (snapshot) => {
                    setComments(snapshot.docs.map((doc) => ({
                        ...doc.data(), id:doc.id
                    })))
                }
            )
        }
    }, [ideaid]);




    return (

        <div ref={componentRef} className="xl:col-start-1 xl:col-end-12 px-4 mb-14 mt-14">

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


            <Card>
                <CardHeader color="green" contentPosition="none">
                    <div className="w-full flex items-center justify-between">

                        <div>
                            <h2 className="text-white text-2xl flex items-center">Exception Report</h2>
                            <div className='flex items-center'>
                                <Listbox value={selectedVisibility} onChange={setSelectedVisiblity}>
                                    <div className="relative">

                                        <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 
                                                                    focus-visible:ring-opacity-75 focus-visible:ring-white 
                                                                    focus-visible:ring-offset-blue-300 focus-visible:ring-offset-2 
                                                                    focus-visible:border-indigo-500 sm:text-sm"
                                        >
                                            <span className="text-gray-800">{selectedVisibility.name}</span>
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
                                    ripple="light"
                                    className="ml-3"
                                    onClick={filter}
                                >
                                    filter
                                </Button>
                            </div>
                        </div>

                        <ReactToPrint
                            trigger={
                                () => (
                                    <span className="flex items-center">
                                        <PrinterIcon className="h-5 mr-1"/> Print
                                    </span>
                                )
                            }

                            content={
                                () => componentRef.current
                            }
                        />
                    </div>
                </CardHeader>
                <CardBody>
                    <div className="overflow-x-auto">
                        <table className="items-center w-full bg-transparent border-collapse">
                            <thead>
                                <tr>
                                    <th className="px-2 text-teal-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
                                        Idea
                                    </th>
                                    <th className="px-2 text-teal-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
                                        Author Email
                                    </th>
                                    <th className="px-2 text-teal-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
                                        Date
                                    </th>
                                    <th className="px-2 text-teal-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
                                        Thumb ups
                                    </th>
                                    <th className="px-2 text-teal-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
                                        Thumb downs
                                    </th>
                                    {
                                        filtered && selectedVisibility.name === "Anonymous ideas" && (
                                            <th className="px-2 text-teal-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
                                                Anonymous comments
                                            </th>
                                        )
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    nocmtideas.map((nocmt) =>(
                                        <tr>
                                            <td className="border-b truncate w-[10px] border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
                                                <div className="w-[200px]">
                                                    <NavLink to={`/idea/${nocmt?.id}`} target="_blank" rel="noopener noreferrer" className="bg-transparent block truncate hover:underline">
                                                        {nocmt.idea}
                                                    </NavLink>
                                                </div>
                                            </td>
                                            <td className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
                                                {nocmt.staffEmail}
                                            </td>
                                            <td className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
                                                {new Date(nocmt?.ideaDate?.seconds*1000).toLocaleDateString()}
                                            </td>
                                            <td className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
                                                {nocmt.thumbupCount}
                                            </td>
                                            <td className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
                                                {nocmt.thumbdownCount}
                                            </td>
                                            {
                                                filtered && selectedVisibility.name === "Anonymous ideas" && (
                                                    <td className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
                                                        <Button
                                                            color="green"
                                                            onClick={
                                                                () => {
                                                                    setShowModal(true)
                                                                    setIdeaid(nocmt.id)
                                                                }
                                                            }
                                                        >
                                                            View Anonymous Comments
                                                        </Button>
                                                    </td>
                                                )

                                            }
                                        </tr>   
                                    ))
                                }   
                                
                            </tbody>
                        </table>
                    </div>
                </CardBody>
            </Card>


            {/* anonoymous idea modal */}
            <Modal size="lg" active={showModal} toggler={() => setShowModal(false)}>
                <ModalHeader toggler={() => setShowModal(false)}>
                    <h5 className="flex item-center">
                        <Icon name="list" size="2xl"/> &nbsp; <span className="-mt-1"> Anonymous Comments </span>
                    </h5>
                </ModalHeader>

                <ModalBody>
                <table className="items-center w-full bg-transparent border-collapse">
                            <thead>
                                <tr>
                                    <th className="px-2 text-teal-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
                                        Commenter Email
                                    </th>
                                    <th className="px-2 text-teal-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
                                        Comment
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    comments.length === 0 ? (
                                        <h1 className='w-full text-gray-700 px-4 mt-3'>No anonymous comment!</h1>
                                    )
                                    :
                                    comments.map((cmt) =>(
                                        <tr>
                                            <td className="border-b truncate w-[10px] border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
                                                {cmt.commenterEmail}
                                            </td>
                                            <td className="border-b border-gray-200 align-middle font-light text-sm px-2 py-4 text-left">
                                                {cmt.comment}
                                            </td>
                                        </tr>   
                                    ))
                                }   
                                
                            </tbody>
                        </table>
                </ModalBody>

            </Modal>


        </div>
    )
}

export default ExceptionReport