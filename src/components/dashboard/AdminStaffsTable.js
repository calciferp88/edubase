import React, { useState, useEffect } from 'react';

import { PlusCircleIcon } from '@heroicons/react/solid';

import Card from '@material-tailwind/react/Card';
import CardHeader from '@material-tailwind/react/CardHeader';
import CardBody from '@material-tailwind/react/CardBody';

import Modal from "@material-tailwind/react/Modal";
import ModalHeader from "@material-tailwind/react/ModalHeader";
import ModalBody from "@material-tailwind/react/ModalBody";
import ModalFooter from "@material-tailwind/react/ModalFooter";
import Button from '@material-tailwind/react/Button';
import Input from '@material-tailwind/react/Input';
import { OfficeBuildingIcon, UserGroupIcon } from '@heroicons/react/solid';

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
    deleteDoc,
    onSnapshot
} from 'firebase/firestore';
import { db, auth } from '../../config';
import { NavLink } from 'react-router-dom';

// firebase auth
import { createUserWithEmailAndPassword } from "firebase/auth";

function AdminStaffsTable() {

    document.title = "Dashboard | Administration staffs";

    const currentUser =  auth.currentUser; // current authed user
    const [showModal, setShowModal] = useState(false);
    const [showModal1, setShowModal1] = useState(false); //confirmation dialog
    const [ delid, setDelid ] = useState("");


    const [ loading, setLoading ] = useState(false);

    // retrieve states
    const [ deptdis, seteptdis ] = useState([]);
    const [ admins, setAdmins ] = useState([]);

    // input states
    const [adminstaff, setAdminstaff] = useState('');
    const [email, setEmail]           = useState('');
    const [phone, setPhone]           = useState('');
    const [edubasemail, setEdubasemail] = useState('');
    const [role, setRole]               = useState('');
    const [department, setDepartment]   = useState('');
    const [password, setPassword]       = useState('');

    // retrieve departments
    useEffect(() =>{
        onSnapshot(
        query(collection(db, "department"), orderBy("timestamp", "desc")),
            (snapshot) => {
                seteptdis(snapshot.docs.map((doc) => ({
                    ...doc.data(), id: doc.id
                })));
            }   
        )
    }, [db]);

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

    // Delete admin staff
    const onDelete = (id) => {
            // database reference
            const data = doc(db, 'adminStaff', id);
            deleteDoc(data).then(()=>{
            toast.error("Admin Staff Deleted Successfully", 
            { pauseOnHover:true });
            setShowModal1(false);
            
        }).catch(() =>{
            toast.error("Error deleting data", {
                pauseOnHover: true
            });
        });
    }

    // upload admin
    const uploadAdmin = async() =>{
        
        // loading animation on
        setLoading(true);

        // database reference
        await createUserWithEmailAndPassword(auth, edubasemail, password);
        await auth.updateCurrentUser(currentUser);
        
        await addDoc(collection(db, 'adminStaff'), {
            adminName: adminstaff,
            adminEmail: email,
            adminPhone: phone,
            edubaseMail: edubasemail,
            adminRole: role,
            adminDepartment: department,
            staffPassword: password,
            timestamp: serverTimestamp(),
        }) 

        .then(()=> {
            toast.success("Admin staff registered successfully", 
            { pauseOnHover:true });
        }).catch(() =>{
            toast.error("Error Submitting data", {
              pauseOnHover: true
            });
        })

        setLoading(false);
        setAdminstaff('');
        setEmail('');
        setEdubasemail('');
        setRole('');
        setDepartment('');
        setPassword('');
        setShowModal(false);
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
                <CardHeader color="orange" contentPosition="none">
                    <div className="w-full flex items-center justify-between">
                        <h2 className="text-white text-2xl flex items-center"><UserGroupIcon className='h-6'/> &nbsp; Administration staffs</h2>

                        <Button
                            className="group"
                            color="transparent"
                            buttonType="link"
                            onClick={(e) => setShowModal(true)}
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
                                        Name
                                    </th>
                                    <th className="px-2 text-purple-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
                                        EduBase Mail
                                    </th>
                                    <th className="px-2 text-purple-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
                                        Role
                                    </th>
                                    <th className="px-2 text-purple-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
                                        Department
                                    </th>
                                    <th className="px-2 text-purple-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    admins.map((admin) => {
                                        return (
                                            <tr>
                                                <th className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
                                                    {admin.adminName}
                                                </th>
                                                <th className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
                                                    {admin.edubaseMail}
                                                </th>
                                                <th className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
                                                    {
                                                        admin.adminRole === "QAM" ? 
                                                                            "Quality Assurance Manager"
                                                                            : "Quality Assurance Coordinator"
                                                    }
                                                </th>
                                                <th className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
                                                    {
                                                        admin.adminDepartment
                                                    }
                                                </th>
                                                <th className="border-b flex items-center border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
                                                    <NavLink to={{ pathname:'/admin-staffs-edit' }} state={{ editadmin: admin }}>
                                                        <Button>Edit</Button>
                                                    </NavLink>

                                                    <Button 
                                                        className="ml-5"
                                                        color = "red"
                                                        onClick={() => {
                                                            setShowModal1(true)
                                                            setDelid(admin.id)
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
                        <UserGroupIcon className='h-6'/> &nbsp; <span className="-mt-1"> Delete Admin Staff </span>
                    </h2>
                </ModalHeader>

                <ModalBody>
                    <p>Are you sure you want to delete the admin staff?</p>
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
                        Delete Admin Staff
                    </Button>
                </ModalFooter>
            </Modal>

            <Modal size="large" active={showModal} toggler={() => setShowModal(false)}>
                <ModalHeader toggler={() => setShowModal(false)}>
                    <div className="flex items-center"><UserGroupIcon className='h-6'/> &nbsp; Add Admin-staffs</div>
                </ModalHeader>

                <ModalBody>
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
                                    type="text"
                                    color="orange"
                                    placeholder="Staff Email"
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
                                    placeholder="Create Edubase Mail (example@edubase.qam/qac)"
                                    value={edubasemail}
                                    onChange={(e) => setEdubasemail(e.target.value)}
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
                                    <option value="">-- Choose Role ---</option>      
                                    <option value="QAM">Quality Assurance Manager</option>
                                    <option value="QAC">Quality Assurance Coordinator</option>
                                </select>
                            </div>

                            <div className="w-full pr-4 mb-10 font-light">
                            <label className="mr-2">Choose Department</label>

                                <select 
                                    required = {true}
                                    value={department}
                                    onChange={(e) => setDepartment(e.target.value)}
                                    className="shadow-md outline-none p-3 rounded-md ml-2"
                                >
                                <option value="">-- Choose Department ---</option>
                                    { 
                                        deptdis.map((deptdi) => (
                                            <option value={deptdi.departmentName} key={deptdi.id}>{deptdi.departmentName}</option>
                                        ))                                    
                                    }
                                </select>
                            </div>

                            <div className="w-full pr-4 mb-10 font-light">
                                <Input
                                    type="password"
                                    color="orange"
                                    placeholder="Create password (Password must be at least 6 charaters)"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
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
                        onClick={uploadAdmin}
                        ripple="light"
                        disabled={!adminstaff || !email || !phone || !edubasemail || !password}
                        className="disabled:bg-gray-300 disabled:hover:bg-gray-300"
                    >
                        { loading ? "Submitting data..." : "Register Admin Staff" }
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
}

export default AdminStaffsTable;
