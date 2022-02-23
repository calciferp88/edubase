import React, { useState, useEffect } from 'react';

// tailwind components 
import Input from '@material-tailwind/react/Input';
import Textarea from '@material-tailwind/react/Textarea';
import Button from '@material-tailwind/react/Button';

// metarial tailwind card
import Card from '@material-tailwind/react/Card';
import CardHeader from '@material-tailwind/react/CardHeader';
import CardBody from '@material-tailwind/react/CardBody';
import { OfficeBuildingIcon } from '@heroicons/react/solid';

// for db
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

// Toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// For firebase
import { 
    collection, 
    doc,
    updateDoc
} from 'firebase/firestore';
import { db } from '../../config';

function DeptEdit() {

    const Navigate = useNavigate();

    // get data 
    const location = useLocation();
    const [enabled, setEnabled] = useState(false);
    
    // update states 
    const [ deptname, setDeptname ] = useState(location.state.editdept.departmentName);
    const [ desc, setDesc ] = useState(location.state.editdept.departmentDescription);
    const [ status, setStatus ] = useState(location.state.editdept.departmentStatus);
    const [ loading, setLoading ] = useState(false);

    // reset data
    const resetData = (e) => {
        e.preventDefault();
        setDeptname(location.state.editdept.departmentName);
        setDesc(location.state.editdept.departmentDescription);
        setStatus(location.state.editdept.departmentStatus);
    }

    // update data
    const updateDept = (e) => {
        e.preventDefault();
        // database reference
        const databaseRef = doc(db, 'department', location.state.editdept.id);

        // loading on
        setLoading(true);

        updateDoc(databaseRef, {departmentName: deptname, departmentDescription: desc, departmentStatus: status})
        .then(()=>{
            setLoading(false);
            toast.success("Department Updated Successfully", 
            { pauseOnHover:true }, Navigate('/departments'));
            
            
        }).catch(() =>{
            toast.error("Error updating data", {
                pauseOnHover: true
            });
        });
    }


    return (
        <>
        <ToastContainer />
        <Card>

            <CardHeader color="gray" contentPosition="none">
                <div className="mb-2">
                    <NavLink to='/dashboard'  className="text-sm hover:font-semibold">Dashboard </NavLink> / 
                    <NavLink to='/departments'  className="text-sm hover:font-semibold">Departments</NavLink> /
                </div>
                <div className="w-full flex items-center">
                    <h2 className="text-white text-2xl font-bold flex items-center"><OfficeBuildingIcon className="h-6" /> &nbsp;Department Edit</h2>
                </div>
            </CardHeader>

            <CardBody>
                    
                
            <form>
                <div className='flex flex-wrap mt-5'>

                    <div className="w-full pr-4 mb-10 font-light">
                        <Input
                            type="text"
                            color="gray"
                            placeholder="Department Name"
                            value={deptname}
                            onChange={(e) => setDeptname(e.target.value)}
                        />
                        
                    </div>

                    <div className="w-full pr-4 mb-10 font-light">
                        <Textarea 
                            color="gray" 
                            placeholder="Description" 
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                        />
                        
                    </div>

                    <div className="flex items-center">
                        <label className="mr-2">Status</label>
                        <select 
                            required = {true}
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="shadow-md outline-none p-3 rounded-md ml-2"
                        >    
                            <option value={false}>Active</option>
                            <option value={true}>Close</option>
                        </select>

                    </div>

                    <div className="w-full mb-10 mt-10 flex">
                        <Button 
                            onClick={updateDept} 
                            type="submit"
                            disabled={!deptname || !desc}
                            className="disabled:bg-gray-300 disabled:hover:bg-gray-300"
                        >
                            { loading === true
                              ? "Updating..."
                              : "Submit"
                            }
                        </Button>

                        <Button 
                            color="red"
                            ripple="dark"
                            className="ml-3"
                            onClick={resetData}
                        >
                                Reset  
                        </Button>
                    </div>

                </div>
            </form>

            </CardBody>
        </Card>
        </> 
    )
}

export default DeptEdit;