import React, { useState, useEffect } from 'react';
import { Avatar } from '@material-ui/core';
import Moment from "react-moment";
import {
    ChartBarIcon,
    ChatIcon,
    DotsHorizontalIcon,
    HeartIcon,
    ShareIcon,
} from "@heroicons/react/outline";
import {
    collection,
    doc,
    getDoc,
    onSnapshot,
    query,
    where
} from "firebase/firestore";
import { db } from '../../config';

function Comment({id, comment}) {

    const [ username, setUsername ] = useState([]);

    // to display userName
    useEffect(() => {
        onSnapshot(
            query(collection(db, "generalStaff"), where("edubaseMail", "==", comment.commenterEmail)),
            (snapshot) => {
                setUsername(snapshot.docs.map((doc) => ({
                    ...doc.data(), id: doc.id
                })));
            }
        )
    }, [db]);

    return (
        <div className="p-3 flex cursor-pointer border-b border-grey-700">

            
            {
                comment.anonymousStatus === "Public" ? (
                    <Avatar className="h-11 w-11 rounded-full mr-4 border border-gray-500 uppercase">
                        {comment.commenterEmail[0]}
                    </Avatar>
                ) : (
                    <Avatar className="h-11 w-11 rounded-full mr-4 border border-gray-500 uppercase">
                        A
                    </Avatar>
                )
            }

            <div className='flex flex-col space-y-2 w-full'>

                <div className='flex justify-between'>
                    <div className='text-gray-700'>
                        <div className='inline-block group'>
                            {
                                comment.anonymousStatus === "Public" ? (
                                    username.map((uname) => (
                                        <h4 className="font-bold text-[15px] sm:text-base inline-block group-hover:underline">
                                            {uname.staffName}
                                        </h4>
                                    ))
                                ) : (
                                    <h4 className="font-bold text-[15px] sm:text-base inline-block group-hover:underline">
                                        Anonymous
                                    </h4>
                                )
                            }
                            {
                                comment.anonymousStatus === "Public" ? (
                                    <span className="ml-1.5 text-sm sm:text-[15px]">
                                        {comment?.commenterEmail}{" "}
                                    </span>
                                ) : (
                                    <span className="ml-1.5 text-sm sm:text-[15px]">
                                        anonymous@edubase.edu{" "}
                                    </span>
                                )
                            }
                            
                        </div>{" "}
                        .{" "}
                        <span className="hover:underline text-sm sm:text-[15px]">
                            <Moment fromNow>{comment?.timestamp?.toDate()}</Moment>
                        </span>
                        <p className="text-gray-700 mt-0.5 max-w-lg text-[15px] sm:text-base">
                            {comment?.comment}
                        </p>
                    </div>
                    <div className="icon group flex-shrink-0">
                        <DotsHorizontalIcon className="h-5 text-[#6e767d] group-hover:text-[#1d9bf0]" />
                    </div>
                </div>

                <div className='text-[#6e767d] flex justify-between w-10/12'>
                    <div className='icon group'>
                        <ChatIcon className='h-5 group-hover:text-[#1d9bf0]'/>
                    </div>

                    <div className="flex items-center space-x-1 group">
                        <div className="icon group-hover:bg-pink-600/10">
                            <HeartIcon className="h-5 group-hover:text-pink-600" />
                        </div>
                        <span className="group-hover:text-pink-600 text-sm"></span>
                    </div>

                    <div className="icon group">
                        <ShareIcon className="h-5 group-hover:text-[#1d9bf0]" />
                    </div>
                    <div className="icon group">
                        <ChartBarIcon className="h-5 group-hover:text-[#1d9bf0]" />
                    </div>

                </div>
            </div>

        </div>
    )
}

export default Comment