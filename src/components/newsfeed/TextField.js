import React from 'react';
import { ErrorMessage, useField } from 'formik';

export const TextField = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    return (
        <div className="mb-3">
            <label className="text-white">
                {label}
            </label>
            <input
                className={`w-full shadow-md py-3 px-6 ring-1 ring-gray-300 rounded-xl placeholder-gray-600 bg-transparent transition
                            ${meta.touched && meta.error && 'border-red-500 border ring-0'}  outline-none focus:ring-gray-400 focus:border-red-400 rounded-md`} 
                {...field} {...props}
                autoComplete="off"
            />
            <ErrorMessage component="div" name={field.name} className="text-red-600 absolute text-sm text-bold mt-1 pl-1" />
        </div>
    )
}