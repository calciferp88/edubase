import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../../components/newsfeed/Sidebar';
import Detail from '../../components/newsfeed/Detail';
import Widget from '../../components/newsfeed/Widget';
import Edit from '../../components/newsfeed/Edit';
import {
    collection,
    doc,
    getDoc,
    onSnapshot,
    query,
    orderBy,
    where
} from "firebase/firestore";
import { db } from '../../config';

function IdeaEdit() {

    document.title = `EduBase | Idea Edit`;

    const location = useLocation();

    const id = location.state.id;
    const categoryName = location.state.editidea.categoryName;
    const categoryID = location.state.editidea.categoryID;
    const ideaText = location.state.editidea.idea;
    const image = location.state.editidea.image;
    const documentFile = location.state.editidea?.document;
    
    

    return (
        <div className='bg-white min-h-screen flex max-w-[1500px] mx-auto'>
            <Sidebar/>
            <Edit
                id={id}
                categoryName={categoryName}
                categoryID={categoryID}
                ideaText={ideaText}
                image= {image}
                document={documentFile}
            />
            <Widget/>
        </div>
    ) 
}

export default IdeaEdit