import React, { useEffect, useState,Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/dashboard/Footer';
import Sidebar from '../../components/dashboard/Sidebar';
import StatusCard from '../../components/dashboard/StatusCard';
import { NavLink } from 'react-router-dom';
import Card from '@material-tailwind/react/Card';
import CardHeader from '@material-tailwind/react/CardHeader';
import CardBody from '@material-tailwind/react/CardBody';
import Button from '@material-tailwind/react/Button';
import {
    UserIcon,
    DotsHorizontalIcon,
    TrendingUpIcon
} from "@heroicons/react/outline";
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';


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
    where
} from 'firebase/firestore';
import { db } from '../../config';
import { useSelector } from 'react-redux'; //redux
import { selectUser } from '../../features/userSlice';
import ChartComponent from '../../components/dashboard/ChartComponent';
import BarChartComponent from '../../components/dashboard/BarChartComponent';
import ExceptionReport from '../../components/dashboard/ExceptionReport';




function Dashboard() { 

    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const email = user.email;
    const role = email.split("edubase.")[1];

    // rolecheck
    useEffect(() =>{
        if(role === "edu"){
            navigate("/");
        }
    }, []);


    // display states
    const [ admins, setAdmins ] = useState([]);
    const [ general, setGeneral ] = useState([]);
    const [ departments, setDepartments ] = useState([]);
    const [ categories, setCategories ] = useState([]);
    const [ ideas, setIdeas ] = useState([]);
    const [ expireds, setExpireds ]     = useState([]);


    // retirve and display admin staffs
    useEffect(() =>{
        onSnapshot(
        query(collection(db, "adminStaff"), orderBy("timestamp", "desc")),
            (snapshot) => {
                setAdmins(snapshot.docs.map((doc) => ({
                    ...doc.data(), id: doc.id
                })));
            }   
        )
    }, [db]);

    // retirve and display general staffs
    useEffect(() =>{
        onSnapshot(
        query(collection(db, "generalStaff"), orderBy("timestamp", "desc")),
            (snapshot) => {
                setGeneral(snapshot.docs.map((doc) => ({
                    ...doc.data(), id: doc.id
                })));
            }   
        )
    }, [db]);
    
    
    // reterive and display categories
    useEffect(() =>{
        onSnapshot(
        query(collection(db, "category")),
            (snapshot) => {
                setCategories(snapshot.docs.map((doc) => ({
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


    // reterive and display departments
    useEffect(() =>{
        onSnapshot(
        query(collection(db, "department"), orderBy("timestamp", "desc")),
            (snapshot) => {
                setDepartments(snapshot.docs.map((doc) => ({
                    ...doc.data(), id: doc.id
                })));
            }   
        )
    }, [db]);

    // reterive and display ideas
    useEffect(() =>{
        onSnapshot(
        query(collection(db, "idea"), orderBy("ideaDate", "desc")),
            (snapshot) => {
                setIdeas(snapshot.docs.map((doc) => ({
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


    return(
        <>
            <Sidebar/>
            <div className="md:ml-64">
                <div className="bg-light-blue-500 px-3 md:px-8 h-40" />

                {/* number counts */}
                <div className='px-3 md:px-3 -mt-24'>
                    <div className='container mx-auto max-w-full'>
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 mb-4">

                            {
                                role === 'qam' && (
                                    <>
                                        <NavLink to="/admin-staffs" className="bg-transparent shadow-none">
                                            <StatusCard
                                                color="orange"
                                                icon="groups"
                                                title="New Users"
                                                percentage={admins.length}
                                                percentageColor="orange"
                                                date="Admin Staffs"
                                            />
                                        </NavLink>

                                        <NavLink to="/categories" className="bg-transparent shadow-none">
                                            <StatusCard
                                                color="pink"
                                                icon="&nbsp;&nbsp;&nbsp;lists"
                                                title="Traffic"
                                                percentage={categories.length}
                                                percentageColor="pink"
                                                date="Active Categories"
                                            />
                                        </NavLink>
                                        
                                        <NavLink to="/departments" className="bg-transparent shadow-none">
                                            <StatusCard
                                                color="gray"
                                                icon="apartment"
                                                title="Sales"
                                                amount="924"
                                                percentage={departments.length}
                                                percentageColor="gray"
                                                date="Departments"
                                            />
                                        </NavLink>

                                        <NavLink to="/" target="_blank" rel="noopener noreferrer" className="bg-transparent shadow-none">
                                            <StatusCard
                                                color="green"
                                                icon="light"
                                                title="Performance"
                                                amount="49,65%"
                                                percentage={ideas.length}
                                                percentageIcon="arrow_upward"
                                                percentageColor="green"
                                                date="Ideas Posts"
                                            />
                                        </NavLink>
                                    </>
                                ) 
                            }

                            {
                                role === 'qac' && (
                                    <>
                                        <NavLink to="/general-staffs" className="bg-transparent shadow-none">
                                            <StatusCard
                                                color="orange"
                                                icon="groups"
                                                title="New Users"
                                                percentage={general.length}
                                                percentageColor="orange"
                                                date="General Staffs"
                                            />
                                        </NavLink>

                                        <NavLink to="/ideas" className="bg-transparent shadow-none">
                                            <StatusCard
                                                color="green"
                                                icon="light"
                                                title="Performance"
                                                amount="49,65%"
                                                percentage="12"
                                                percentageIcon="arrow_upward"
                                                percentageColor="green"
                                                date="Ideas Posts"
                                            />
                                        </NavLink>
                                    </>
                                ) 
                            }
                        </div>
                    </div>
                </div>
                

                {/* Charts */}
                <div className="px-3 md:px-3 h-auto mt-5">
                    <div className="container mx-auto max-w-full">
                        <div className="grid grid-cols-1 xl:grid-cols-12">
                            <div className="xl:col-start-1 xl:col-end-6 px-4 mb-14">
                                <Card>
                                    <CardHeader color="pink" contentPosition="none">
                                        <div className="w-full flex items-center justify-between">
                                            <h2 className="text-white text-2xl">Category chart</h2>
                                        </div>
                                    </CardHeader>
                                    <CardBody>
                                        <ChartComponent/>
                                    </CardBody>
                                </Card>
                            </div>
                            <div className="xl:col-start-6 ml-3 xl:col-end-12 px-4 mb-14">
                                <Card>
                                    <CardHeader color="orange" contentPosition="none">
                                        <div className="w-full flex items-center justify-between">
                                            <h2 className="text-white text-2xl">Our Community</h2>
                                        </div>
                                    </CardHeader>
                                    <CardBody>
                                        <BarChartComponent/>
                                    </CardBody>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-3 md:px-3 h-auto mt-5">
                    <div className="container mx-auto max-w-full">
                        <div className="grid grid-cols-1 xl:grid-cols-5">

                            {/* expired categories */}
                            <div className="xl:col-start-1 xl:col-end-12 px-4 mb-14">
                                <Card>
                                    <CardHeader color="pink" contentPosition="none">
                                        <div className="w-full flex items-center justify-between">
                                            <h2 className="text-white text-2xl">Expired Categories</h2>
                                        </div>
                                    </CardHeader>
                                    <CardBody>
                                        <div className="overflow-x-auto">
                                            <table className="items-center w-full bg-transparent border-collapse">
                                                <thead>
                                                    <tr>
                                                        <th className="px-2 text-teal-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
                                                            Category
                                                        </th>
                                                        <th className="px-2 text-teal-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
                                                            Description
                                                        </th>
                                                        <th className="px-2 text-teal-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
                                                            View
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        expireds.map((category) =>(
                                                                
                                                                    <tr>
                                                                        <td className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
                                                                            { category.categoryName }
                                                                        </td>
                                                                        <td className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
                                                                            { category.description }
                                                                        </td>
                                                                        <td className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
                                                                        <NavLink to={{ pathname:'/ideas' }} state={{ cateid: category }}>
                                                                                <Button 
                                                                                    color = "pink"
                                                                                >
                                                                                    Export Ideas
                                                                                </Button>
                                                                        </NavLink>
                                                                        </td>
                                                                    </tr>   
                                                        ))
                                                    }   
                                                    
                                                </tbody>
                                            </table>
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>
                            
                            {/* Exception report */}
                            <ExceptionReport/>
                            

                        </div>
                    </div>
                </div>
                
            <Footer />

            </div>
        </>
    )
}

export default Dashboard;
