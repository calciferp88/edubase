import React, { useState, useEffect } from 'react';
import { SearchIcon } from '@heroicons/react/outline';
import { NavLink } from 'react-router-dom';

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
    orderByChild,
    endAt
} from 'firebase/firestore';
import { db } from '../../config';


function Widget() {

    
    const [ categories, setCategories ] = useState([]);

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

    // For closure dates
    const dateObj = new Date();
    const month = dateObj.getUTCMonth() + 1; //months from 1-12
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();
    
    const todayDate = month + "/" + day + "/" + year;

    return (
        <div className="hidden lg:block ml-3 xl:w-[450px] sm:w-[300px] md-[400px] py-1 space-y-5 bg-white">

            <div className="sticky top-0 space-y-3">
                {/* search bar */}
                <div className='bg-white pb-3 pt-2 z-50 w-11/12 xl:w-9/12'>
                    <div className='flex items-center bg-[#efefef] p-3 rounded-full relative'>
                        <SearchIcon className='text-gray-400 h-5 z-50'/>
                        <input
                            type="text"
                            className="bg-transparent placeholder-gray-500 outline-none text-gray-800
                            absolute inset-0 pl-11 border border-transparent w-full focus:border-gray-300 
                            rounded-full focus:bg-[#DDD] focus:shadow-md"
                            placeholder="Search edubase..."
                        />      
                    </div>
                </div>

                {/* Idea categories */}
                <div className='text-[#6E6E6E] space-y-3 bg-[#efefef] py-2 rounded-xl w-11/12 xl:w-9/12'>
                    <h4 className='font-bold text-xl px-4 mb-3'>Idea Categories</h4>
                    {
                        categories.length === 0 ? (
                            <h1 className='w-full text-gray-700 px-4 mt-3'>Loading...</h1>
                        ) : (

                            categories.map((category) => (
                                todayDate < new Date(category.closureDate.seconds*1000).toLocaleDateString() && (
                                        <NavLink key={category.id} to={{ pathname:'/share' }} state={{ sharecate: category }} >
                                            <div className='hover:bg-gray-300 px-4 py-2 cursor-pointer transition duration-200 ease-out flex items-center justify-between'>
                                                <div className='space-y-0.5'>
                                                    <h6 className='text-gray-700 text-lg font-semibold'>{category.categoryName}</h6>
                                                    <p className='text-gray-700 max-w-[250px] text-[13px] block truncate'>
                                                        {category.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </NavLink>
                                    )
                                )
                            )

                        )
                    }
                </div>
            </div>

        </div>
    );
}

export default Widget;
