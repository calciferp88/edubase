import React, { useState, useEffect } from 'react'
import Icon from '@material-tailwind/react/Icon';

import Card from '@material-tailwind/react/Card';
import CardHeader from '@material-tailwind/react/CardHeader';
import CardBody from '@material-tailwind/react/CardBody';

import { useSelector } from 'react-redux'; //redux
import { selectUser } from '../../features/userSlice';

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
    onSnapshot,
    where
} from 'firebase/firestore';
import { db } from '../../config';


function Mail() {

    const user = useSelector(selectUser);
    const [ notis, setNotis ]= useState([]);
    const [ qacdept, setQacdept ]= useState([]);
    const [ lol, setLol ] = useState("");


    // qac deptarmnt from redux + firestore
    useEffect(() =>{

        onSnapshot(
            query(collection(db, "adminStaff"), where("edubaseMail", "==", user.email)),
            (snapshot) => {
                setQacdept(snapshot.docs.map((doc) => ({
                    ...doc.data(), id: doc.id
                })));
            }
        );
    
    }, [db]);

    useEffect(()=>{
        qacdept.map((dept)=> (
            setLol(dept.adminDepartment)
        ))
    }, [qacdept]);



    // fetch notification 
    useEffect(() => {
        if(lol){
            onSnapshot(
                query(collection(db, "notification-2"), where("department", "==", lol)),
                    (snapshot) => {
                        setNotis(snapshot.docs.map((doc) => ({
                            ...doc.data(), id: doc.id
                        })));
                    }   
                )
        }
    }, [lol]);

    return (
        <>
            <Card>
                <CardHeader color="pink" contentPosition="none">
                    <div className="w-full flex items-center justify-between">
                        <h2 className="text-white text-2xl flex items-center"><Icon name="email" size="2xl"/> &nbsp; Idea Mails</h2>
                    </div>
                </CardHeader>

                <CardBody>
                    <div className="overflow-x-auto">
                        <table className="items-center w-full bg-transparent border-collapse">
                            <thead>
                                <tr>
                                    <th className="px-2 text-purple-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
                                        Author Email
                                    </th>
                                    <th className="px-[30px] text-purple-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
                                        Idea posted
                                    </th>
                                    <th className="px-2 text-purple-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
                                        Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                { 
                                    notis.map((noti) => (
                                        <tr>
                                            <th className="border-b border-gray-20 font-light align-top text-sm px-2 py-4 text-left">
                                                {noti.authorEmail}
                                            </th>
                                            <td className="border-b border-gray-200 align-top font-light text-sm px-[30px] py-4 text-left">
                                                {noti.idea}
                                            </td>
                                            <td className="border-b border-gray-200 align-top font-light text-sm px-2 py-4 text-left">
                                                {new Date(noti?.timestamp?.seconds*1000).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </CardBody>
            </Card>
        </>
    )
}

export default Mail