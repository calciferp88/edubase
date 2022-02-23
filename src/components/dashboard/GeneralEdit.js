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
import { UserGroupIcon as GStaffIcon } from '@heroicons/react/outline';

// For firebase
import { 
    collection, 
    doc,
    updateDoc,
    getDocs,
    query, 
    onSnapshot,
    orderBy
} from 'firebase/firestore';
import { db } from '../../config';


// Toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function GeneralEdit() {

    const [ loading, setLoading ] = useState(false);
    const Navigate = useNavigate();
    const location = useLocation();
    
    // retrieve dept
    const [ departments, setDepartments ] = useState([]);

    // retrieve departments
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

    // input states
    const [generalstaff, setGeneralstaff] = useState(location.state.editgeneral.staffName);
    const [email, setEmail]             = useState(location.state.editgeneral.staffEmail);
    const [phone, setPhone]             = useState(location.state.editgeneral.staffPhone);
    const [edubasemail, setEdubasemail] = useState(location.state.editgeneral.edubaseMail);
    const [role, setRole]               = useState(location.state.editgeneral.staffRole);
    const [gender, setGender]           = useState(location.state.editgeneral.staffGender);
    const [department, setDepartment]   = useState(location.state.editgeneral.staffDepartment);

    // update general staff
    const updateGeneral = (e) =>{
        e.preventDefault();
        // database reference
        const databaseRef = doc(db, 'generalStaff', location.state.editgeneral.id);

        // loading on
        setLoading(true);

        updateDoc(databaseRef, {staffName: generalstaff, 
                                staffEmail: email, 
                                staffPhone: phone, 
                                staffGender: gender,
                                edubaseMail: edubasemail, 
                                staffRole: role, 
                                staffDepartment: department
                            })
        .then(()=>{
            setLoading(false);
            toast.success("Staff Updated Successfully", 
            { pauseOnHover:true }, Navigate('/general-staffs '));
            
            
        }).catch(() =>{
            toast.error("Error updating data", {
                pauseOnHover: true
            });
        });
    }

    // reset data
    const reset = (e) => {
        e.preventDefault();
        setGeneralstaff(location.state.editgeneral.staffName);
        setEmail(location.state.editgeneral.staffEmail);
        setPhone(location.state.editgeneral.staffPhone);
        setEdubasemail(location.state.editgeneral.edubaseMail);
        setRole(location.state.editgeneral.staffRole);
        setDepartment(location.state.editgeneral.staffDepartment);
    }

    return (
        <>
            <Card>

                <CardHeader color="orange" contentPosition="none">
                    <div className="mb-2">
                        <NavLink to='/dashboard'  className="text-sm hover:font-semibold">Dashboard </NavLink> / 
                        <NavLink to='/general-staffs'  className="text-sm hover:font-semibold">General Staffs</NavLink> /
                    </div>
                    <div className="w-full flex items-center">
                        <h2 className="text-white text-2xl font-bold flex items-center">
                            <GStaffIcon className="h-6" /> &nbsp; General Staff Edit
                        </h2>
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
                                    value={generalstaff}
                                    onChange={(e) => setGeneralstaff(e.target.value)}
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
                                    placeholder="EdubaseMail cannot be changed"
                                    value={edubasemail}
                                    onChange={(e) => setEdubasemail(e.target.value)}
                                    readOnly={true}
                                />
                            </div>

                            <div className="w-full pr-4 mb-10 font-light">
                                <label className="mr-2">Choose staff Gender</label>
                                <select 
                                    required = {true}
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    className="shadow-md outline-none p-3 rounded-md ml-2  "
                                >   
                                    <option value={gender}>
                                        { 
                                            gender === "M" && "Male"
                                        }
                                        {
                                            gender === "FM" && "Female"
                                        }
                                        {
                                            gender === "PNS" && "Prefer not to say"
                                        }
                                    </option>      
                                    <option value="M">Male</option>
                                    <option value="FM">Female</option>
                                    <option value="PNS">Prefer not to say</option>
                                </select>
                            </div>

                            <div className="w-full pr-4 mb-10 font-light">
                                <label className="mr-2">Choose admin staff role</label>
                                <select 
                                    required = {true}
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="shadow-md outline-none p-3 rounded-md ml-2  "
                                >   
                                    <option value={role}>{role === 'SS'?"Support Staff":"Academic Staff"}</option>      
                                    <option value="SS">Support Staff</option>
                                    <option value="AS">Academic Staff</option>
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
                                    onClick={updateGeneral}
                                    disabled={!generalstaff || !email || !phone || !edubasemail }
                                    className="disabled:bg-gray-300 disabled:hover:bg-gray-300"
                                >
                                    { loading ? "Updating..." : "Update Staff data" }
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

export default GeneralEdit;
