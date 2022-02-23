import React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from "../assets/img/faviconEdu.png";
import { useSelector } from 'react-redux'; //redux
import { selectUser } from '../features/userSlice';

function Login() {

    const user = useSelector(selectUser);

    return (
        <div className="w-full flex flex-col pt-10 items-center h-[100vh]">
            {
                !user && (
                    <div className="bg-gray-100 mt-[70px] p-7 px-[60px] rounded-md shadow-md flex flex-col items-center">
                        <img
                            src={Logo}
                            alt="Edubase Logo"
                            width={110}
                            height={110}
                            className="mb-5"
                        />
                        <NavLink to="/login" className="px-5 py-3 bg-blue-500 rounded-md hover:bg-blue-700 text-white font-sm">
                            Please Login First
                        </NavLink>
                    </div>
                )
            }
            
        </div>
    );
}

export default Login;
