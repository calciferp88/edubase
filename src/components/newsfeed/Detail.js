import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    ArrowLeftIcon,
} from "@heroicons/react/outline";
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
import DetailPost from './DetailPost';

// Toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Comment from './Comment';



function Detail({ id }) {

    document.title = `EduBase | Idea Detail`;

    const navigate = useNavigate();


    const [ idea, setIdea ] = useState("");
    const [ comments, setComments ] = useState([]);


    // idea detail diaplay
    useEffect(() =>{

        // Idea
        getDoc(doc(db, "idea", id)).then(docSnap => {
            if (docSnap.exists()) {
                setIdea(docSnap.data());
            } else {
                console.log("No such document!");
            }
        });   

        // comments
        onSnapshot(
            query(
                collection(db, "idea", id, "comments"),
                orderBy("timestamp", "desc")
            ),
            (snapshot) => setComments(snapshot.docs)
        )

        


    }, []);

    const onPrevious = () => {
        navigate(-1);
    }



    return (

        <>

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

            <div className="flex-grow flex-[0.4] border-l border-r border-gray-300 max-w-2xl sm:ml-[73px] xl:ml-[350px]">

                <div className="pb-56">

                    {/* header */}
                    <div className="flex shadow-sm items-center sm:justify-between py-3 px-3 sticky top-0 z-10 border-b bg-white border-gray-300">
                        <div className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0 mr-auto">
                            <div onClick={onPrevious} exact>
                                <ArrowLeftIcon className="h-5 text-gray-800" />
                            </div>
                        </div>
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 truncate">
                            Idea
                        </h2>
                    </div>

                    <DetailPost 
                        idea={idea} 
                        id={id}
                        staffEmail={idea.staffEmail}
                    />

                    {/* comments */}
                    {
                        comments.map((comment) => (
                            <Comment
                                key={comment.id}
                                id={comment.id}
                                comment={comment.data()}
                            />
                        ))
                    }

                </div>
            </div>

        </>


    );
}

export default Detail;
