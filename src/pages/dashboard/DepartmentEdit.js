import React from 'react';
import DeptEdit from '../../components/dashboard/DeptEdit';
import Footer from '../../components/dashboard/Footer';
import Sidebar from '../../components/dashboard/Sidebar';

function DepartmentEdit() {
  return (
    <>
       <Sidebar/>
        <div className='md:ml-64'>

            <div className="bg-light-blue-500 pt-14 pb-28 px-3 md:px-8 h-auto">
                
            </div>

            <div className="px-3 md:px-8 h-auto -mt-24">
                <div className="container mx-auto max-w-full">
                    <div className="grid grid-cols-1 px-4 mb-16">
                        <DeptEdit />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    </>
)
}

export default DepartmentEdit;
