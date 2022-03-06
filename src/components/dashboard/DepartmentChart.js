import React, { useEffect, useState, useRef } from 'react'
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
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);

function DepartmentChart() {

    const summaryRef = useRef(null);
    const [ departments, setDepartments] = useState([]);
    const [charView, setChatView] = useState([]);
    const [ total, setTotal ] =  useState(0);
    

    // staffs
    useEffect(() =>{
        onSnapshot(
        query(collection(db, "department"), where("ideaCount", ">", 0)),
            (snapshot) => {
                setDepartments(snapshot.docs.map((doc) => ({
                    ...doc.data(), id: doc.id
                })));
            }   
        )
    }, [db]);

    // ideas
    useEffect(() =>{
          onSnapshot(
          query(collection(db, "idea")),
              (snapshot) => {
                  setTotal(snapshot.docs.map((doc) => ({
                      ...doc.data(), id: doc.id
                  })));
              }   
          )
      }, [db]);


    // useEffect(() => {
    //   departments.map((dept) => (
    //     setTotal(total + dept.ideaCount)
    //   ))
    // }, [departments]);
  
    

    const data = {
        labels: departments.map((dept)=>(
            dept.departmentName
        )),
        datasets: [
          {
            label: "# of Votes",
            data: departments.map((dept) => (
              dept.ideaCount
            )),
            backgroundColor: ["#1e7eeb", "#2ee860", "#f52f42", "#f52f56"],
            borderColor: ["#1e7eeb", "#2ee860", "#f52f42", "#f52f02"],
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

       
       <div className="mt-7">
        {
          departments.map((dept) => {

            const percent = parseInt(dept.ideaCount / total.length * 100); 

            return (
              <p>
                {dept.departmentName} : {percent} %
              </p>
            )

          })
        }
        </div>
      
    </div>

  )
}

export default DepartmentChart