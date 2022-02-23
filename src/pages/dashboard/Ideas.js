import React, {useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Footer from '../../components/dashboard/Footer'
import Sidebar from '../../components/dashboard/Sidebar'
import { CSVLink, CSVDownload } from "react-csv";
// metarial tailwind card
import Card from '@material-tailwind/react/Card';
import CardHeader from '@material-tailwind/react/CardHeader';
import CardBody from '@material-tailwind/react/CardBody';
import ClosingAlert from "@material-tailwind/react/ClosingAlert";
// jszip
import {saveAs} from 'file-saver';
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


function Ideas() {

    document.title = "Dashboard | Ideas";

    const location = useLocation();

    const zip = require('jszip')();


    const [ ideas, setIdeas ] = useState([]);
    const [ gotit, setGotit ] = useState([]);
    const [ files, setFiles ] = useState([]);
    

    // for detaill display
    const categoryName = location.state.cateid.categoryName;
    const closuredate  = new Date(location.state.cateid.closureDate.seconds*1000).toLocaleDateString();
    const fclosuredate = new Date(location.state.cateid.finalClosureDate.seconds*1000).toLocaleDateString();
    const description  = location.state.cateid.description;
    
    // reterive ideas 
    useEffect(() =>{
        const categoryID   = location.state.cateid.id;

        if(categoryID){
            onSnapshot(
            query(collection(db, "idea"), where("categoryID", "==", categoryID)),
                (snapshot) => {
                    setIdeas(snapshot.docs.map((doc) => ({
                        ...doc.data(),
                    })));
                }  
            )
        }
    }, [db]);

    useEffect(() => {
            setGotit(   
                ideas.map((idea) => ({
                    Idea_Text: idea.idea,
                    Category: idea.categoryName,
                    Staff_Email: idea.staffEmail,
                    Thumb_Up: idea.thumbupCount,
                    Thumb_Down: idea.thumbdownCount,
                    View: idea.viewCount,
                    Comment: idea.commentCount,
                })
            )
        )
    }, [ideas])


    useEffect(() => {
        setFiles(
            ideas.map((idea) => (
                idea.document
            ))
        )
    }, [ideas])
    
    console.log("documents--->", files);

    // CSV export
    const exportCSV = {
        filename: 'idea.csv',
        data: gotit
    }

    // zip file Download
    const exportZip = () => {
        files.map((archive) =>{
            const base64String = btoa(archive);
            zip.file("supportdocs", base64String, {base64: true});
        });
        
        zip.generateAsync({type: 'blob'}).then(content =>{
            saveAs(content, "supportdocs.zip");
        });

    }

  return (
    <>
        <Sidebar/>
        <div className="md:ml-64">
            <div className="bg-light-blue-500 px-3 md:px-8 h-40" />

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
                                <h2 className="text-white text-2xl font-bold">Idea Export</h2>
                            </div>
                            
                        </CardHeader>

                        <CardBody>
                            <div className="flex items-center text-gray-800 mb-7">
                                <span className="font-semibold w-[140px]">Category Name</span>
                                <span className="ml-2">:&nbsp;&nbsp; { categoryName }</span>
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
                                    {description}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                {
                                    ideas.length !== 0 ? (
                                        <CSVLink {...exportCSV}>
                                            <span class="inline-flex overflow-hidden cursor-pointertext-black border border-l-0 border-gray-700 rounded group hover:bg-gray-700 hover:text-white transition-all duration-150">
                                                <span class="px-3.5 py-2 text-white bg-pink-700 group-hover:bg-pink-600 flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                </svg>
                                                </span>
                                                <span class="pl-4 pr-5 py-2.5 font-bold">Export Ideas to CSV</span>
                                            </span>
                                        </CSVLink>

                                    ) : (
                                        <ClosingAlert color="deepOrange">No Idea to export from this category</ClosingAlert>
                                    )
                                }


                                {/* Zip file */}
                                <span 
                                onClick={exportZip}
                                class="inline-flex overflow-hidden cursor-pointertext-black border border-l-0 border-gray-700 rounded group hover:bg-gray-700 hover:text-white transition-all duration-150">
                                    <span class="px-3.5 py-2 text-white bg-pink-700 group-hover:bg-pink-600 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                    </svg>
                                    </span>
                                    <span class="pl-4 pr-5 py-2.5 font-bold">Download Zip</span>
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

export default Ideas