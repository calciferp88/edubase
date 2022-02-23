import { useState, useEffect, useRef } from "react";
import React from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
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

} from 'firebase/firestore';
import { db } from '../../config';

ChartJS.register(ArcElement, Tooltip, Legend);



function ChartComponent() {

    // for pie chat data
    const [ unpublisheds, setUnpublisheds ] = useState([]);
    const [ publisheds, setpublisheds ]     = useState([]);
    const [ expireds, setExpireds ]         = useState([]);
    const [ gotit, setGotit ]               = useState([]);


    // get published categories
    useEffect(() =>{
        onSnapshot(
        query(collection(db, "category"), where("categoryStatus", "==", "Unpublished")),
            (snapshot) => {
                setUnpublisheds(snapshot.docs.map((doc) => ({
                    ...doc.data(), id: doc.id
                })));
            }   
        )
    }, [db]);

    // get published categories
    useEffect(() =>{
        onSnapshot(
        query(collection(db, "category"), where("categoryStatus", "==", "Published")),
            (snapshot) => {
                setpublisheds(snapshot.docs.map((doc) => ({
                    ...doc.data(), id: doc.id
                })));
            }   
        )
    }, [db]);
    

    // get expired categories
    useEffect(() =>{
        const now = new Date(new Date().toUTCString());
        onSnapshot(
        query(collection(db, "category"), where("finalClosureDate", "<", now)),
            (snapshot) => {
                setExpireds(snapshot.docs.map((doc) => ({
                    ...doc.data(), id: doc.id
                })));               
            }   
        )
    }, [db]);
    
    const data = {
        labels: ["Unpublished", "Published", "Expired"],
        datasets: [
          {
            label: "# of Votes",
            data: [
                unpublisheds.length, 
                publisheds.length, 
                expireds.length
            ],
            backgroundColor: ["#1e7eeb", "#2ee860", "#f52f42"],
            borderColor: ["#1e7eeb", "#2ee860", "#f52f42"],
            borderWidth: 2,
          },
        ],
      };
      
      const pieOptions = {
        plugins: {
          legend: {
            display: true,
            labels: {
              font: {
                size: 12,
              },
            },
          },
        },
      };

  const [charView, setChatView] = useState([]);
  const summaryRef = useRef(null);

  useEffect(() => {
    setChatView(summaryRef?.current?.legend?.legendItems);
  }, []);

  return (
    <div className="w-[300px] py-3">


        <Pie data={data} options={pieOptions} ref={summaryRef} /> 
        {charView?.map((data, i) => (
            <div key={i}>
                <div
                    className={`w-[6px] h-[6px] bg-[${data?.fillStyle}] `}
                />
            </div>
		))}
    </div>
  )
}

export default ChartComponent