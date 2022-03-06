import React, { useEffect, useState } from 'react'
// import { Chart as ChartJS, ArcElement, Tooltip, Legend , CategoryScale, LinearScale, bar } from "chart.js";
import { Chart, registerables } from 'chart.js';
import { Bar } from "react-chartjs-2";
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

// ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);
Chart.register(...registerables);


function BarChartComponent() {


    const [ qams, setQams ] = useState([]);
    const [ qacs, setQacs ] = useState([]);
    const [ academics, setAcademics ] = useState([]);
    const [ supports, setSupports ] = useState([]);


    // get QAMs
    useEffect(() =>{
        onSnapshot(
        query(collection(db, "adminStaff"), where("adminRole", "==", "QAM")),
            (snapshot) => {
                setQams(snapshot.docs.map((doc) => ({
                    ...doc.data(), id: doc.id
                })));
            }   
        )
    }, [db]);


    // get QACs
    useEffect(() =>{
        onSnapshot(
        query(collection(db, "adminStaff"), where("adminRole", "==", "QAC")),
            (snapshot) => {
                setQacs(snapshot.docs.map((doc) => ({
                    ...doc.data(), id: doc.id
                })));
            }   
        )
    }, [db]);

    // get Academic staff
    useEffect(() =>{
        onSnapshot(
        query(collection(db, "generalStaff"), where("staffRole", "==", "AS")),
            (snapshot) => {
                setAcademics(snapshot.docs.map((doc) => ({
                    ...doc.data(), id: doc.id
                })));
            }   
        )
    }, [db]);

    // get Supports staff
    useEffect(() =>{
        onSnapshot(
        query(collection(db, "generalStaff"), where("staffRole", "==", "SS")),
            (snapshot) => {
                setSupports(snapshot.docs.map((doc) => ({
                    ...doc.data(), id: doc.id
                })));
            }   
        )
    }, [db]);


    // static labels
    const labels = [
        'QA Manager',
        'QA Coordinator',
        'Academic Staff',
        'Support Staff',
      ];
    
    const data = {
    labels: labels,
    datasets: [{
        label: 'Number of Staffs in Edubase', 
        backgroundColor: '#ff9800',
        borderColor: '#ff9800',
        data: [qams.length, qacs.length, academics.length, supports.length],    
    }]
    };

    const options = {
        maintainAspectRatio: true,
    }

  return (
    <div className="pt-3">
        <Bar options={options} data={data} height={233} />
    </div>
  )
}

export default BarChartComponent