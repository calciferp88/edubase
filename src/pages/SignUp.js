import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import { TextField } from '../components/newsfeed/TextField';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { openModal } from '../features/modalSlice';

import Card from '@material-tailwind/react/Card';
import CardHeader from '@material-tailwind/react/CardHeader';
import CardBody from '@material-tailwind/react/CardBody';




function SignUp() {

    const dispatch = useDispatch();


    // validations
    const validate = Yup.object({
        firstName: Yup.string()
            .max(15, 'Must be 15 characters or less')
            .required('First Name is Required'),
        lastName: Yup.string()
            .max(20, 'Must be 20 characters or less')
            .required('Last Name is Required'),
        email: Yup.string()
            .email('Email is invalid')
            .required('Email is required'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 charaters')
            .required('Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Password must match')
            .required('Confirm password is required'),
    })

    // signUp
    const signUp = (values) => {
        console.log(values);
    }


    return (
        <>
            <div>
                
                <Formik
                    initialValues={{
                        firstName: '',
                        lastName: '',
                        email: '',
                        password: '',
                        confirmPassword: ''
                    }}
                    validationSchema={validate}
                    onSubmit={signUp}
                >
                    {formik => (
                        <div className='pt-10 flex flex-col items-center space-y-10 w-full h-[100vh]'>
                            <h1 className="font-bold text-xl text-white">Sign Up</h1>
                            {/* <button
                                onClick={() => dispatch(openModal())} 
                                className='bg-blue-500 px-3 py-3 font-bold text-center text-white text-2xl'>
                                Open Modal
                            </button> */}
                            <Form>

                                <TextField 
                                    label="First Name" 
                                    name="firstName" 
                                    type="text"
                                    placeholder="Enter First Name" 
                                />
                                <TextField 
                                    label="last Name" 
                                    name="lastName" 
                                    type="text"
                                    placeholder="Enter Last Name" 
                                />
                                <TextField 
                                    label="Email" 
                                    name="email" 
                                    type="email"
                                    placeholder="Enter Email" 
                                />
                                <TextField 
                                    label="password" 
                                    name="password" 
                                    type="password"
                                    placeholder="Enter Password" 
                                />
                                <TextField 
                                    label="Confirm Password" 
                                    name="confirmPassword" 
                                    type="password"
                                    placeholder="Confirm Password" 
                                />

                                <button 
                                    type="submit"
                                    className="mt-5 relative inline-flex items-center justify-start px-6 py-3 overflow-hidden font-medium transition-all bg-white rounded hover:bg-white group"
                                >
                                    <span className="w-48 h-48 rounded rotate-[-40deg] bg-[#1d9bf0] absolute bottom-0 left-0 -translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
                                    <span className="relative w-full text-left text-black transition-colors duration-300 ease-in-out group-hover:text-white">
                                        submit
                                    </span>
                                </button>


                                <button 
                                    type="reset"
                                    className="ml-5 mt-5 relative inline-flex items-center justify-start px-6 py-3 overflow-hidden font-medium transition-all bg-white rounded hover:bg-white group"
                                >
                                    <span className="w-48 h-48 rounded rotate-[-40deg] bg-red-400 absolute bottom-0 left-0 -translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
                                    <span className="relative w-full text-left text-black transition-colors duration-300 ease-in-out group-hover:text-white">
                                        Cancel
                                    </span>
                                </button>

                            </Form>
                        </div>
                    )}
                </Formik>
            </div>

        </>
    )
}

export default SignUp;

