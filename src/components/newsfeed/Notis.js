import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/userSlice';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
} from "@heroicons/react/outline";
import Noti from './Noti';
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



function Notis() {

    const navigate = useNavigate();
    const [ notifications, setNotifications ] = useState([]); // to count noti counts
    console.log(notifications);
    const user = useSelector(selectUser);


    const onPrevious = () => {
        navigate(-1);
    }

    // reterive own notification
    useEffect(() =>{
        onSnapshot(
            query(collection(db, "notification"), where("authorEmail", "==", user?.email)),
                (snapshot) => {
                    setNotifications(snapshot.docs.map((doc) => ({
                        ...doc.data(), id: doc.id
                    })));
                }   
            )
    }, [db]);

  return (
    <div className="flex-grow flex-[0.4] border-l border-r border-gray-300 max-w-2xl sm:ml-[73px] xl:ml-[350px]">

        <div className="flex shadow-sm items-center sm:justify-between py-3 px-3 sticky top-0 z-10 border-b bg-white border-gray-300">
            <div className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0 mr-auto">
                <div onClick={onPrevious} exact>
                    <ArrowLeftIcon className="h-5 text-gray-800" />
                </div>
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700 truncate">
                Notifications
            </h2>
        </div>

        <div className="">
            {
                notifications.map((noti) => (
                    <Noti
                        key={noti.id}
                        id={noti.id}
                        commenterEmail = {noti.commenterEmail}
                        ideaID = {noti.ideaID}
                        timestamp = {new Date(noti?.timestamp?.seconds*1000).toLocaleDateString()}
                        status = {noti.status}
                    />
                ))
            }
        </div>

    </div>
  )
}

export default Notis