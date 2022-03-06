import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Icon from '@material-tailwind/react/Icon';
import { PlusCircleIcon } from '@heroicons/react/solid';

import Card from '@material-tailwind/react/Card';
import CardHeader from '@material-tailwind/react/CardHeader';
import CardBody from '@material-tailwind/react/CardBody';

import Modal from "@material-tailwind/react/Modal";
import ModalHeader from "@material-tailwind/react/ModalHeader";
import ModalBody from "@material-tailwind/react/ModalBody";
import ModalFooter from "@material-tailwind/react/ModalFooter";

import Input from '@material-tailwind/react/Input';
import Textarea from '@material-tailwind/react/Textarea';
import Button from '@material-tailwind/react/Button';

// Toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// For firebase
import { 
    collection, 
    addDoc,
    getDocs, 
    serverTimestamp,
    orderBy, 
    query,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot
} from 'firebase/firestore';
import { db } from '../../config';

function CategoriesTable() {

    const [showModal, setShowModal] = useState(false); // add modal
    const [showModal1, setShowModal1] = useState(false); //confirmation dialog
    const [ delid, setDelid ] = useState("");
    const [ loading, setLoading ] = useState(false);
    const [ categories, setCategories ] = useState([]);

    // input states
    const [category, setCategory] = useState('');
    const [desc, setDesc] = useState('');


    // reterive and display categories
    useEffect(() =>{
        onSnapshot(
        query(collection(db, "category"), orderBy("timestamp", "desc")),
            (snapshot) => {
                setCategories(snapshot.docs.map((doc) => ({
                    ...doc.data(), id: doc.id
                })));
            }   
        )
    }, [db]);


    // save category
    const saveCategory = async() => {
        
            // loading animation on
            setLoading(true);

            // database reference
            await addDoc(collection(db, 'category'), {
                categoryName: category,
                closureDate: null,
                finalClosureDate: null,
                description: desc,
                categoryStatus: 'Unpublished',
                adminID:1, 
                timestamp: serverTimestamp(),
            }) 

            .then(()=> {
                toast.success("Category added successfully", 
                { pauseOnHover:true });
            }).catch(() =>{
                toast.error("Error submittng data", {
                    pauseOnHover: true
                });
            })
            
            setLoading(false);
            setCategory('');
            setDesc('');
            setShowModal(false);
        
    }

    // Delete category
    const onDelete = (id) => {
        // database reference
        const data = doc(db, 'category', id);
        deleteDoc(data).then(()=>{
        toast.error("Category Deleted Successfully", 
        { pauseOnHover:true });
        setShowModal1(false);
        
        }).catch(() =>{
            toast.error("Error deleting data", {
                pauseOnHover: true
            });
        });
    }

    // unpublish category
    const onUnpublish = async (id) => {
        const data = doc(db, 'category', id);
        await updateDoc(data, { categoryStatus: 'Unpublished', closureDate: null, finalClosureDate: null })
        .then(()=>{ 
            setLoading(false);
            toast.success("Category Unpublished", { 
                pauseOnHover:true 
            });
        }).catch(() =>{
            toast.error("Error publishing data", {
            pauseOnHover: true
            });
        });
    }
    
    return(
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
            <Card>
                <CardHeader color="pink" contentPosition="none">
                    <div className="w-full flex items-center justify-between">
                        
                        <h2 className="text-white text-2xl flex items-center"><Icon name="list" size="2xl"/> &nbsp; Categories</h2>

                        <Button
                            className="group"
                            onClick={(e) => setShowModal(true)}
                            color="transparent"
                            buttonType="link"
                            size="lg"
                            style={{ padding: 0 }}
                        >
                            <PlusCircleIcon className="h-5" />
                            Add
                        </Button>
                    </div>
                </CardHeader>

                <CardBody>
                    <div className="overflow-x-auto">
                        <table className="items-center w-full bg-transparent border-collapse">
                            <thead>
                                <tr>
                                    <th className="px-2 text-purple-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
                                        Categories
                                    </th>
                                    <th className="px-2 text-purple-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
                                        Description
                                    </th>
                                    <th className="px-2 text-purple-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
                                        Status
                                    </th>
                                    <th className="px-2 text-purple-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                { 
                                    categories.map((category)=>{
                                        return(

                                            <tr>
                                                <th className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
                                                    <NavLink to={{ pathname:'/category-detail' }} state={{ detailcat: category }} className="hover:underline">
                                                        {category.categoryName}
                                                    </NavLink>
                                                </th>
                                                <th className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
                                                    <div className="w-[200px]">
                                                        <p className="block truncate">{category.description}</p>
                                                    </div>
                                                </th>
                                                <th className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
                                                    {category.categoryStatus}
                                                </th>
                                                <th className="flex items-center border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
                                                    
                                                    <div className="w-[120px]">
                                                        {
                                                            category.categoryStatus === 'Published' && (
                                                                <Button onClick={() => onUnpublish(category.id)} color="green">
                                                                    Unpublish
                                                                </Button>
                                                            )
                                                        }
                                                        {
                                                            category.categoryStatus === "Unpublished" &&  (
                                                                <NavLink to={{ pathname:'/category-publish' }} state={{ pubcate: category }}>
                                                                    <Button className="bg-blue-500">
                                                                        Publish
                                                                    </Button>
                                                                </NavLink>
                                                            )
                                                        }
                                                    </div>
                                                    

                                                    <NavLink to={{ pathname:'/category-edit' }} state={{ editcate: category }} className="ml-3">
                                                        <Button>Edit</Button>
                                                    </NavLink>
                                                    
                                                    {
                                                        category.categoryStatus === 'Published' && (
                                                            <Button 
                                                                className="ml-3 disabled:bg-gray-300 disabled:hover:bg-gray-300"
                                                                color = "red"
                                                                disabled="disabled"
                                                            >
                                                                DELETE
                                                            </Button>
                                                        )
                                                    }

                                                    {
                                                        category.categoryStatus === 'Unpublished' && (
                                                            <Button 
                                                                className="ml-3 disabled:bg-gray-300 disabled:hover:bg-gray-300"
                                                                color = "red"
                                                                // onClick = {() => onDelete(category.id)}
                                                                onClick={() => {
                                                                    setShowModal1(true)
                                                                    setDelid(category.id)
                                                                }}
                                                            >
                                                                DELETE
                                                            </Button>
                                                        )
                                                    }
                                                    
                                                </th>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </CardBody>
            </Card>
            
            {/* confirmation dialog */}
            <Modal size="medium" active={showModal1} toggler={() => setShowModal(false)}>

                <ModalHeader toggler={() => setShowModal1(false)}>
                    <h2 className="flex item-center text-red-500">
                        <Icon name="list" size="2xl"/> &nbsp; <span className="-mt-1"> Delete Category </span>
                    </h2>
                </ModalHeader>

                <ModalBody>
                    <p>Are you sure you want to delete the category?</p>
                </ModalBody>

                <ModalFooter>
                    <Button 
                        color="blue"
                        onClick={(e) => setShowModal1(false)}
                        ripple="dark"
                    >
                        Cancel
                    </Button>

                    <Button
                        color="red"
                        onClick={() => onDelete(delid)}
                        ripple="light"
                    >
                        Delete Category
                    </Button>
                </ModalFooter>
            </Modal>


            {/* add category modal */}
            <Modal size="large" active={showModal} toggler={() => setShowModal(false)}>
                <ModalHeader toggler={() => setShowModal(false)}>
                    <h2 className="flex item-center">
                        <Icon name="list" size="2xl"/> &nbsp; <span className="-mt-1"> Add Category </span>
                    </h2>
                </ModalHeader>

                <ModalBody>
                    <form>
                        <div className='flex flex-wrap mt-5'>

                            <div className="w-full pr-4 mb-10 font-light">
                                <Input
                                    type="text"
                                    color="pink"
                                    placeholder="Category Name"
                                    value={category}
                                    onChange={ (e)=>{setCategory(e.target.value)} }
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

                        </div>
                    </form>
                </ModalBody>

                <ModalFooter>
                    <Button 
                        color="red"
                        onClick={(e) => setShowModal(false)}
                        ripple="dark"
                    >
                        Cancel
                    </Button>

                    <Button
                        color="green"
                        onClick={saveCategory}
                        disabled={!category || !desc}
                        ripple="light"
                        className="disabled:bg-gray-300 disabled:hover:bg-gray-300"
                    >
                        { loading ? "Submitting data..." : "Submit Category" }
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
}

export default CategoriesTable;
