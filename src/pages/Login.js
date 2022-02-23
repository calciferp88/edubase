import React, { useEffect, useState } from 'react';
import Logo from "../assets/img/faviconEdu.png";
import { Formik, Form } from 'formik'; // Form validation
import * as Yup from 'yup'; // Form validation
import { TextField } from '../components/newsfeed/TextField';
import { useNavigate, Navigate } from 'react-router-dom';
import Bgimg from "../assets/img/loginbg.png";
import { auth } from '../config';
import { signInWithEmailAndPassword  } from "firebase/auth";
import { login, selectUser } from '../features/userSlice';
import { useDispatch, useSelector } from 'react-redux'; //redux

// Toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {

    document.title = "Edubase";


    const [ show, setShow ] = useState(false); //for password visibility
    const [ loading, setLoading ] = useState(false);

    const dispatch = useDispatch();
    const user = useSelector(selectUser); // user from state
    const navigate = useNavigate();
    
    // validations
    const validate = Yup.object({
        email: Yup.string()
            .email('Email is invalid')
            .required('Email is required'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 charaters')
            .required('Password is required'),
    });

    // signIn
    const signIn = async (values) => {

        setLoading(true);
        
        const email = values.email;
        const password = values.password;

        await signInWithEmailAndPassword( auth, email, password )
        .then((userAuth) =>{
            
            dispatch(login({
                email: userAuth.user.email,
                uid: userAuth.user.uid,
                displayName: userAuth.user.displayName,
            }));

            // role checks
            const role = email.split("edubase.")[1];
            if(role === "qam"){
                navigate("/dashboard");
            }
            if(role === "qac"){
                navigate("/dashboard");
            }
            if(role === "edu"){
                navigate("/");
            }

        })
        .catch(() =>{
            toast.error("Email or password is worng", {
                pauseOnHover: true
            });
        });

        setLoading(false);
        
        
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
            <div className="2xl:container h-screen m-auto">

                <div hidden className="fixed py-3 inset-0 w-7/12 lg:block">
                    <img className="w-full h-full object-contain" src={Bgimg} alt="Edubase" />
                </div>

                <div hidden class="fixed inset-0 w-6/12 ml-auto bg-white bg-opacity-70 backdrop-blur-xl lg:block"></div>

                <div className="relative h-full ml-auto lg:w-6/12">
                    <div className="m-auto py-12 px-6 sm:p-20 xl:w-10/12">

                        <div className="space-y-4">
                            <img src={Logo} alt="tailus logo" width={130} height={130} />
                            <h1 className="font-medium text-xl text-gray-600">Welcome to EduBase. Login first!</h1>
                        </div>
                        

                        {/* Sign In Form */}
                        <Formik
                            initialValues={{
                                email: '',
                                password: '',
                            }}
                            validationSchema={validate}
                            onSubmit={signIn}
                        >
                            {
                                formik => (
                                    <div className='pt-2 space-y-10 w-full'>
                                        <Form>
                                            
                                            <TextField 
                                                label="Email" 
                                                name="email" 
                                                type="email"
                                                placeholder="edubasemail" 
                                            />

                                            <div className='relative'>
                                                <TextField 
                                                    label="password" 
                                                    name="password" 
                                                    type={show ? "text" : "password"}
                                                    placeholder="password" 
                                                />
                                                <span 
                                                    onClick={() => setShow(!show)}
                                                    className='absolute bottom-3 right-2 cursor-pointer'
                                                >
                                                    
                                                    {
                                                        show ? (
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="text-gray-500 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                            </svg>
                                                        ) : (
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="text-gray-500 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                        )
                                                    }
                                                </span>
                                            </div>

                                            <button type="submit" class="focus:outline-none cursor-pointer mt-7 relative inline-block text-lg group">
                                                <span class="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-500 rounded-lg group-hover:text-white">
                                                    <span class="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
                                                    <span class="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-500 group-hover:-rotate-180 ease"></span>
                                                    <span class="relative">
                                                        {
                                                            loading ? "Signing in..." : "Sign in"
                                                        }
                                                    </span>
                                                </span>
                                                <span class="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-500 rounded-lg group-hover:mb-0 group-hover:mr-0" data-rounded="rounded-lg"></span>
                                            </button>

                                        </Form>
                                    </div>
                                )
                            }
                        </Formik>

                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;
