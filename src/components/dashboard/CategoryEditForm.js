import React, { useState, useEffect } from 'react';

// tailwind components 
import Input from '@material-tailwind/react/Input';
import Textarea from '@material-tailwind/react/Textarea';
import Button from '@material-tailwind/react/Button';

// for route
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Icon from '@material-tailwind/react/Icon';

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

function CategoryEditForm() {

  const [ loading, setLoading ] = useState(false);
  const Navigate = useNavigate();
  const location = useLocation();

  // input states
  const [category, setCategory] = useState(location.state.editcate.categoryName);
  const [desc, setDesc] = useState(location.state.editcate.description);

  // update category
  const updateCategory = (e) =>{
    e.preventDefault();
    // database reference
    const databaseRef = doc(db, 'category', location.state.editcate.id);

    setLoading(true);

    updateDoc(databaseRef, { categoryName: category, description: desc, timestamp: serverTimestamp(),  })
        .then(()=>{ 
            setLoading(false);
            toast.success("Category Updated Successfully", 
            { pauseOnHover:true }, Navigate('/categories'));
            
        }).catch(() =>{
            toast.error("Error updating data", {
              pauseOnHover: true
            });
        });
  }

  // reset data
  const reset = (e) => {
    e.preventDefault();
    setCategory(location.state.editcate.categoryName);
    setDesc(location.state.editcate.description);
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
                    <h2 className="text-white text-2xl font-bold flex items-center">
                      <Icon name="list" size="2xl"/> &nbsp; Category Edit
                    </h2>
                </div>
            </CardHeader>

            <CardBody>
              <form>
                <div className='flex flex-wrap mt-5'>

                    <div className="w-full pr-4 mb-10 font-light">
                        <Input
                          type="text"
                          color="pink"
                          placeholder="Category Name"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                        />      
                    </div>

                    <div className="w-full pr-4 mb-10 font-light">
                        <Textarea 
                          color="pink" 
                          placeholder="Category Description" 
                          value={desc}
                          onChange={ (e)=>{setDesc(e.target.value)} }
                        />      
                    </div>

                    <div className="w-full mb-10 mt-10 flex">
                        <Button 
                            type="submit"   
                            onClick={updateCategory}
                            disabled={!category || !desc }
                            className="disabled:bg-gray-300 disabled:hover:bg-gray-300"
                        >
                            { loading ? "Updating..." : "Update Category data" }
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

export default CategoryEditForm;
