import React, { useEffect, useState } from 'react'
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

function NotiPostName({ ideaID }) {

    const [ ideas, setIdeas ] = useState([]);

      
    // reterive for post name
    useEffect(() =>{
        if(ideaID)
        {
            onSnapshot(
                query(collection(db, "idea"), where("id", "==", ideaID)),
                    (snapshot) => {
                        setIdeas(snapshot.docs.map((doc) => ({
                            ...doc.data(), id: doc.id
                        })));
                    }   
            )
        }
    }, [db, ideaID]);

  return (
    <div className="w-[140px] ml-1">
        <p className="block truncate font-bold">
            {
                ideas.map((idea) => (
                    <span>{idea?.idea}</span>
                ))
            }
        </p>
    </div>
  )
}

export default NotiPostName