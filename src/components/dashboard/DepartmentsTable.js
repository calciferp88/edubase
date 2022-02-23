// From react 
import React, { useState, useEffect } from 'react';
import Icon from '@material-tailwind/react/Icon';
import { PlusCircleIcon } from '@heroicons/react/solid';
import { NavLink } from 'react-router-dom';

// metarial tailwind card
import Card from '@material-tailwind/react/Card';
import CardHeader from '@material-tailwind/react/CardHeader';
import CardBody from '@material-tailwind/react/CardBody';

// mt tailwind modals 
import Modal from "@material-tailwind/react/Modal";
import ModalHeader from "@material-tailwind/react/ModalHeader";
import ModalBody from "@material-tailwind/react/ModalBody";
import ModalFooter from "@material-tailwind/react/ModalFooter";

// tailwind components 
import Input from '@material-tailwind/react/Input';
import Textarea from '@material-tailwind/react/Textarea';
import Button from '@material-tailwind/react/Button';

import { OfficeBuildingIcon } from '@heroicons/react/solid';

// Toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// For firebase
import { 
    collection, 
    addDoc,
    getDocs, 
    serverTimestamp,
    orderBy, 
    query,
    doc,
    limit,
    deleteDoc,
    onSnapshot
} from 'firebase/firestore';
import { db } from '../../config';

function DepartmentsTable() {

    const [showModal, setShowModal] = useState(false);
    const [ loading, setLoading ] = useState(false);
    const [showModal1, setShowModal1] = useState(false); //confirmation dialog

    const [ delid, setDelid ] = useState("");

    // display state
    const [departments, setDepartments ] = useState([]);
    
    // input states 
    const [ deptname, setDeptname ] = useState('');
    const [ desc, setDesc ] = useState('');
    
    const [ depterr, setDepterr ] = useState(false); //validation
    const [ descerr, setDescerr] = useState(false); //validation

    // database reference
    const databaseRef = collection(db, 'department');
    var  counter = 1;

    // reterive and display department
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
    

    // save department
    const saveDepartment = async() => {

        // validation
        if(deptname === ''){
            setDepterr(true);
        }
        else if(desc === ''){
            setDescerr(true);
        }
        else{
            // loading animation on
            setLoading(true);

            // database reference
            await addDoc(collection(db, 'department'), {
                departmentName: deptname,
                departmentDescription: desc,
                departmentStatus: false,
                timestamp: serverTimestamp(),
            }) 

            .then(()=> {
                toast.success("Department added successfully", 
                { pauseOnHover:true });
            }).catch(() =>{
                toast.error("Error submittng data", {
                  pauseOnHover: true
                });
            })
            
            setLoading(false);
            setDeptname('');
            setDesc('');
            setShowModal(false);
        }
    }

    // Delete department
    const onDelete = (id) => {
         // database reference
         const data = doc(db, 'department', id);
         deleteDoc(data).then(()=>{
            toast.error("Department Deleted Successfully", 
            { pauseOnHover:true });
        
            setShowModal1(false);
        }).catch(() =>{
            toast.error("Error deleting data", {
              pauseOnHover: true
            });
        });
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
            <Card>
                <CardHeader color="gray" contentPosition="none">
                    <div className="w-full flex items-center justify-between">
                        <h2 className="text-white text-2xl flex items-center"><OfficeBuildingIcon className="h-6" /> &nbsp; Departments</h2>
                        <Button
                            onClick={(e) => setShowModal(true)}
                            color="transparent"
                            buttonType="link"
                            size="lg"
                            style={{ padding: 0 }}
                        >
                            <PlusCircleIcon className="h-5" />
                            Add
                        </Button>
                    </div>
                </CardHeader>

                <CardBody>
                    <div className="overflow-x-auto">
                        <table className="items-center w-full bg-transparent border-collapse">
                            <thead>
                                <tr>
                                    
                                    <th className="px-2 text-purple-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
                                        Department Name
                                    </th>
                                    <th className="px-2 text-purple-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
                                        Description
                                    </th>
                                    <th className="px-2 text-purple-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
                                        Status
                                    </th>
                                    <th className="px-2 text-purple-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                    {
                                        
                                        departments.map((department) => {
                                            return (

                                                <tr key={department.id}>
                                                    
                                                    <th className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
                                                        { department.departmentName}
                                                    </th>
                                                    <th className="truncate border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
                                                        <div className="w-[500px]">
                                                            <p className="block truncate">
                                                                { department.departmentDescription}
                                                            </p>
                                                        </div>
                                                    </th>
                                                    <th className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
                                                        {
                                                            department.departmentStatus === 'false' ? "Active" : "Closed"
                                                        }
                                                    </th>
                                                    <th className="border-b flex items-center border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
                                                        
                                                       <NavLink to={{ pathname:'/dept-edit' }} state={{ editdept: department }}>
                                                           <Button>Edit</Button>
                                                       </NavLink>

                                                        <Button 
                                                            className="ml-5"
                                                            color = "red"
                                                            onClick={() => {
                                                                setShowModal1(true)
                                                                setDelid(department.id)
                                                            }}
                                                        >
                                                            DELETE
                                                        </Button>
                                                    </th>
                                                </tr>
                                            ) 
                                        })
                                        
                                    }    
                               
                            </tbody>
                        </table>
                    </div>
                </CardBody>
            </Card>

            {/* confirmation dialog */}
            <Modal size="medium" active={showModal1} toggler={() => setShowModal(false)}>

                <ModalHeader toggler={() => setShowModal1(false)}>
                    <h2 className="flex item-center text-red-500">
                        <OfficeBuildingIcon className="h-6" /> &nbsp; <span className="-mt-1"> Delete Department </span>
                    </h2>
                </ModalHeader>

                <ModalBody>
                    <p>Are you sure you want to delete the department ?</p>
                </ModalBody>

                <ModalFooter>
                    <Button 
                        color="blue"
                        onClick={(e) => setShowModal1(false)}
                        ripple="dark"
                    >
                        Cancel
                    </Button>

                    <Button
                        color="red"
                        onClick={() => onDelete(delid)}
                        ripple="light"
                    >
                        Delete Department
                    </Button>
                </ModalFooter>
            </Modal>

            <Modal size="large" active={showModal} toggler={() => setShowModal(false)}>
                <ModalHeader toggler={() => setShowModal(false)}>
                    <div className="flex items-center"><OfficeBuildingIcon className="h-6" /> Add Department</div>
                </ModalHeader>

                <ModalBody>
                    <form>
                        <div className='flex flex-wrap mt-5'>

                            <div className="w-full pr-4 mb-10 font-light">
                                <Input
                                    type="text"
                                    color="gray"
                                    placeholder="Department Name"
                                    value={deptname}
                                    onChange={(e) => {
                                        setDeptname(e.target.value)
                                        if(deptname !== ''){
                                            setDepterr(false);
                                        }
                                    }}
                                />
                                {
                                    depterr && (
                                        <span className='text-red-700 font-bold text-sm'>
                                            Deptartment name is required!
                                        </span>
                                    )
                                }
                            </div>

                            <div className="w-full pr-4 mb-10 font-light">
                                <Textarea 
                                    color="gray" 
                                    placeholder="Description" 
                                    value={desc}
                                    onChange={(e) => {
                                        setDesc(e.target.value)
                                        if(desc !== ''){
                                            setDescerr(false);
                                        }
                                    }}
                                />
                                {
                                    descerr && (
                                        <span className='text-red-700 font-bold text-sm'>
                                            Description is required!
                                        </span>
                                    )
                                }
                            </div>


                        </div>
                    </form>
                </ModalBody>

                <ModalFooter>
                    <Button 
                        color="red"
                        onClick={(e) => setShowModal(false)}
                        ripple="dark"
                    >
                        Cancel
                    </Button>

                    <Button
                        color="green"
                        onClick={saveDepartment}
                        disabled={!deptname || !desc}
                        ripple="light"
                        className="disabled:bg-gray-300 disabled:hover:bg-gray-300"
                    >
                        { loading ? "Submitting data..." : "Submit Department" }
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
}

export default DepartmentsTable;