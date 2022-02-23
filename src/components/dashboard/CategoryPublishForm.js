import React, { useState, useEffect } from 'react';

// tailwind components 
import Input from '@material-tailwind/react/Input';
import Textarea from '@material-tailwind/react/Textarea';
import Button from '@material-tailwind/react/Button';

// for route
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

// metarial tailwind card
import Card from '@material-tailwind/react/Card';
import CardHeader from '@material-tailwind/react/CardHeader';
import CardBody from '@material-tailwind/react/CardBody';

// For firebase
import { 
    collection, 
    doc,
    updateDoc,
    getDocs,
    query, 
    serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../config';

// Toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// date time picker
import { DateTimePickerComponent } from '@syncfusion/ej2-react-calendars';

function CategoryPublishForm() {

    const [ loading, setLoading ] = useState(false);
    const Navigate = useNavigate();
    const location = useLocation();

    // input states
    const [ category, setCategory] = useState(location.state.pubcate.categoryName);
    const [ date, setDate ] = useState("");
    const [ fdate, setFDate ] = useState("");
    console.log(date);
    console.log(fdate);

    // publish category
    const publishCategory = async(e) => {
        e.preventDefault();
        // database reference
        const databaseRef = doc(db, 'category', location.state.pubcate.id);

        setLoading(true);

        await updateDoc(databaseRef, { closureDate: date, finalClosureDate: fdate, categoryStatus: 'Published' })
        .then(()=>{ 
            setLoading(false);
            toast.success("Category Published", 
            { pauseOnHover:true }, Navigate('/categories'));
            
        }).catch(() =>{
            toast.error("Error publishing data", {
            pauseOnHover: true
            });
        });
        
    }

    // reset data
    const reset = (e) => {
        e.preventDefault();
        setDate('');
        setFDate('');
    }

    return (
        <>
            <ToastContainer />
            <Card>
                <CardHeader color="pink" contentPosition="none">
                    <div className="mb-2">
                        <NavLink to='/dashboard'  className="text-sm hover:font-semibold">Dashboard </NavLink> / 
                        <NavLink to='/categories'  className="text-sm hover:font-semibold">Categories</NavLink> /
                    </div>
                    <div className="w-full flex items-center">
                        <h2 className="text-white text-2xl font-bold">Category Publish</h2>
                    </div>
                </CardHeader>

                <CardBody>
                    <form>
                        <div className='flex flex-wrap mt-5'>

                            <div className="w-full pr-4 mb-10 font-light">
                                <h1 className="font-semibold text-lg text-gray-700">{category}</h1>
                            </div>

                            <div className="w-full pr-4 mb-10 font-light">
                                <DateTimePickerComponent 
                                    placeholder="Please choose closure date"
                                    value={date}
                                    onChange={(e)=>{setDate(e.target.value)}}
                                >

                                </DateTimePickerComponent>  
                            </div>

                            <div className="w-full pr-4 mb-10 font-light">
                                <DateTimePickerComponent 
                                    placeholder="Please choose final closure date" 
                                    value={fdate}
                                    onChange={(e)=>{setFDate(e.target.value)}}
                                >

                                </DateTimePickerComponent>  
                            </div>
                            

                            <div className="w-full mb-10 mt-10 flex">
                                <Button 
                                    type="submit"   
                                    onClick={publishCategory}
                                    disabled={!date || !fdate }
                                    className="disabled:bg-gray-300 disabled:hover:bg-gray-300"
                                >
                                    { loading ? "Publishing..." : "Publish Category" }
                                </Button>

                                <Button 
                                    color="red"
                                    ripple="dark"
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

export default CategoryPublishForm;
