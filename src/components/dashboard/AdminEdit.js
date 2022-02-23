import React, { useState, useEffect } from 'react';

// tailwind components 
import Input from '@material-tailwind/react/Input';
import Button from '@material-tailwind/react/Button';

// for db
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

// metarial tailwind card
import Card from '@material-tailwind/react/Card';
import CardHeader from '@material-tailwind/react/CardHeader';
import CardBody from '@material-tailwind/react/CardBody';

import { UserGroupIcon } from '@heroicons/react/solid';

// For firebase
import { 
    collection, 
    doc,
    updateDoc,
    getDocs,
    query, 
    onSnapshot
} from 'firebase/firestore';
import { db } from '../../config';

// Toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function AdminEdit() {

    const [ loading, setLoading ] = useState(false);
    const Navigate = useNavigate();
    const location = useLocation();
    
    // retrieve dept
    const [ departments, setDepartments ] = useState([]);

    // input states
    const [adminstaff, setAdminstaff] =  useState(location.state.editadmin.adminName);
    const [email, setEmail]           =  useState(location.state.editadmin.adminEmail);
    const [phone, setPhone]           =  useState(location.state.editadmin.adminPhone);
    const [edubasemail, setEdubasemail] =  useState(location.state.editadmin.edubaseMail);
    const [role, setRole]               =  useState(location.state.editadmin.adminRole);
    const [department, setDepartment]   =  useState(location.state.editadmin.adminDepartment);

    
    const deptdbref = collection(db, 'department');

    // retirve and display admin staffs
    useEffect(() => {
        const getdepartmentData = async () => {
            const data = await getDocs(deptdbref);
            setDepartments(data.docs.map((doc) => ({
                ...doc.data(), id: doc.id
            })))  
        }

        getdepartmentData();
    }, [db]);

    // reset data
    const reset = (e) => {
        e.preventDefault();
        setAdminstaff(location.state.editadmin.adminName);
        setEmail(location.state.editadmin.adminEmail);
        setPhone(location.state.editadmin.adminPhone);
        setEdubasemail(location.state.editadmin.edubaseMail);
        setRole(location.state.editadmin.adminRole);
        setDepartment(location.state.editadmin.adminDepartment);
    }

    // update data
    const updateAdmin = (e) => {
        e.preventDefault();
        // database reference
        const databaseRef = doc(db, 'adminStaff', location.state.editadmin.id);

        // loading on
        setLoading(true);

        updateDoc(databaseRef, {adminName: adminstaff, 
                                adminEmail: email, 
                                adminPhone: phone, 
                                edubaseMail: edubasemail, 
                                adminRole: role, 
                                adminDepartment: department
                            })
        .then(()=>{
            setLoading(false);
            toast.success("Admin Updated Successfully", 
            { pauseOnHover:true }, Navigate('/admin-staffs '));
            
            
        }).catch(() =>{
            toast.error("Error updating data", {
                pauseOnHover: true
            });
        });
    }


    return (
        <>
            <Card>
                <CardHeader color="orange" contentPosition="none">
                    <div className="mb-2">
                        <NavLink to='/dashboard'  className="text-sm hover:font-semibold">Dashboard </NavLink> / 
                        <NavLink to='/admin-staffs'  className="text-sm hover:font-semibold">Admin Staffs</NavLink> /
                    </div>
                    <div className="w-full flex items-center">
                        <h2 className="text-white text-2xl font-bold flex items-center"><UserGroupIcon className='h-6'/> &nbsp;
                            Admin Staff Edit</h2>
                    </div>
                </CardHeader>

                <CardBody>
                    
                    <form>
                        <div className='flex flex-wrap mt-5'>

                            <div className="w-full pr-4 mb-10 font-light">
                                <Input
                                    type="text"
                                    color="orange"
                                    placeholder="Admin Staff Name"
                                    value={adminstaff}
                                    onChange={(e) => setAdminstaff(e.target.value)}
                                />      
                            </div>

                            <div className="w-full pr-4 mb-10 font-light">
                                <Input
                                    type="email"
                                    color="orange"
                                    placeholder="Admin Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />      
                            </div>

                            <div className="w-full pr-4 mb-10 font-light">
                                <Input
                                    type="number"
                                    color="orange"
                                    placeholder="Staff Phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>

                            <div className="w-full pr-4 mb-10 font-light">
                                <Input
                                    type="text"
                                    color="orange"
                                    placeholder="Edubase Mail cannot be changed"
                                    value={edubasemail}
                                    onChange={(e) => setEdubasemail(e.target.value)}
                                    readOnly={true}
                                />
                            </div>

                            <div className="w-full pr-4 mb-10 font-light">
                                <label className="mr-2">Choose admin staff role</label>
                                <select 
                                    required = {true}
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="shadow-md outline-none p-3 rounded-md ml-2  "
                                >   
                                    <option value={role}>{role === 'QAM'?"Quality Assurance Manager":"Quality Assurance Coordinator"}</option>      
                                    <option value="QAM">Quality Assurance Manager</option>
                                    <option value="QAC">Quality Assurance Coordinator</option>
                                </select>
                            </div>

                            <div className="w-full pr-4 mb-10 font-light">
                                <label className="mr-2">Choose admin department</label>
                                <select 
                                    required = {true}
                                    value={department}
                                    onChange={(e) => setDepartment(e.target.value)}
                                    className="shadow-md outline-none p-3 rounded-md ml-2  "
                                >   
                                    <option value={department}>{department}</option>  
                                    { 
                                        departments.map((department) => (
                                            <option value={department.departmentName} key={department.id}>{department.departmentName}</option>
                                        ))                                    
                                    }    
                                </select>
                            </div>

                            <div className="w-full mb-10 mt-10 flex">
                                <Button 
                                    type="submit"
                                    onClick={updateAdmin}
                                    disabled={!adminstaff || !email || !phone || !edubasemail }
                                    className="disabled:bg-gray-300 disabled:hover:bg-gray-300"
                                >
                                    { loading ? "Updating..." : "Update admin data" }
                                </Button>

                                <Button 
                                    color="red"
                                    ripple="orange"
                                    className="ml-3"
                                    onClick={reset}
                                >
                                        Reset  
                                </Button>
                            </div>

                        </div>
                    </form>

                </CardBody>
            </Card>
        </>
    );
}

export default AdminEdit;
