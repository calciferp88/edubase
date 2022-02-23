import React, {useEffect} from 'react';
import AdminStaffsTable from '../../components/dashboard/AdminStaffsTable';
import Footer from '../../components/dashboard/Footer';
import Sidebar from '../../components/dashboard/Sidebar';

import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; //redux
import { selectUser } from '../../features/userSlice';


function AdminStaffs() {

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


    return (
        <>
            <Sidebar/>
            <div className='md:ml-64'>
                <div className="bg-light-blue-500 pt-14 pb-28 px-3 md:px-8 h-auto">
                </div>

                <div className="px-3 md:px-8 h-auto -mt-24">
                    <div className="container mx-auto max-w-full">
                        <div className="grid grid-cols-1 px-4 mb-16">
                            <AdminStaffsTable/>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        </>
    );
}

export default AdminStaffs;
