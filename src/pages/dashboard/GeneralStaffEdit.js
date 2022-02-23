import React from 'react';
import Footer from '../../components/dashboard/Footer';
import GeneralEdit from '../../components/dashboard/GeneralEdit';
import Sidebar from '../../components/dashboard/Sidebar';

function GeneralStaffEdit() {

    document.title = "Dashboard | General Staff Edit";

    return (
        <>
            <Sidebar/>
            <div className='md:ml-64'>

                <div className="bg-light-blue-500 pt-14 pb-28 px-3 md:px-8 h-auto">
                </div>

                <div className="px-3 md:px-8 h-auto -mt-24">
                    <div className="container mx-auto max-w-full">
                        <div className="grid grid-cols-1 px-4 mb-16">
                            <GeneralEdit/>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        </>
    );
}

export default GeneralStaffEdit;
