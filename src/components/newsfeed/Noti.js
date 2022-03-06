import React, { useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import { Avatar } from '@material-ui/core';
import Moment from "react-moment";
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




function Noti({id, commenterEmail, ideaID, timestamp, status }) {

    const navigate = useNavigate();
    const [ comments, setComments ] = useState([]);

    // to count comment amount
    useEffect(() => {
        onSnapshot(
            query(
                collection(db, "idea", ideaID, "comments"),
                orderBy("timestamp", "desc")
            ),
            (snapshot) => setComments(snapshot.docs)
        )
    }, [db, id]);

    // update the noti status
    const seen = () => {

        const databaseRef = doc(db, 'notification', id);

        updateDoc(databaseRef, {
            status: 1,
        })
        .then(()=>{ 
            navigate(`/idea/${ideaID}`);
        }).catch(() =>{
            console.log("Error");
        });

    };

  return (
        <div onClick={seen}  className={`border-b border-gray-300 ${status === 0 ? "bg-gray-200" : "bg-white"} `}>
             <div className="flex items-center ml-3 mr-[5px] py-4 pr-2">
                <div>
                    <Avatar className="h-[30px] rounded-full mr-4 border border-gray-500 uppercase">
                        {commenterEmail[0]} 
                    </Avatar>
                </div>

                <div className="flex flex-col">
                    <div className="flex items-center">
                        {commenterEmail} commented on your idea at
                        <div className="w-[140px] ml-1">
                            <p className="block truncate font-bold">
                                { timestamp }.
                            </p>
                        </div>
                    </div>
                    <small>
                        <Moment fromNow className="pr-2 text-xs">
                            {timestamp}
                        </Moment>
                    </small>
                </div>
            </div>
        </div>
  )
}

export default Noti

// status => 0 -> unread, 1 -> read