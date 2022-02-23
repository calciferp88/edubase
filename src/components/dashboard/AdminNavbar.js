import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '@material-tailwind/react/Button';
import Icon from '@material-tailwind/react/Icon';
import NavbarInput from '@material-tailwind/react/NavbarInput';
import Dropdown from '@material-tailwind/react/Dropdown';
import DropdownItem from '@material-tailwind/react/DropdownItem';
import { Avatar } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../features/userSlice';
import { auth } from '../../config';
import { logout } from "../../features/userSlice";

function AdminNavbar({ showSidebar, setShowSidebar }) {

    const location = useLocation().pathname;

    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Logout
    const Logout = () => {
        dispatch(logout());
        auth.signOut();
        navigate('/login');
    }


    return(
        <nav className="bg-light-blue-500 md:ml-64 mt-0 py-3 px-3 sticky top-0 z-10">
            <div className="container max-w-full mx-auto flex items-center justify-between md:pr-8 md:pl-10">

                <div className="md:hidden">

                    <Button
                        color="transparent"
                        buttonType="link"
                        size="lg"
                        iconOnly
                        rounded
                        ripple="light"
                        onClick={() => setShowSidebar('left-0')}
                    >
                        <Icon name="menu" size="2xl" color="white" />
                    </Button>

                    <div
                        className={`absolute top-2 md:hidden ${
                            showSidebar === 'left-0' ? 'left-64' : '-left-64'
                        } z-50 transition-all duration-300`}
                    >
                        <Button
                            color="transparent"
                            buttonType="link"
                            size="lg"
                            iconOnly
                            rounded
                            ripple="light"
                            onClick={() => setShowSidebar('-left-64')}
                        >
                            <Icon name="close" size="2xl" color="white" />
                        </Button>
                    </div>

                </div>

                <div className="flex justify-between items-center w-full">
                    
                    {/* to display the route name in top section */}
                    <h4 className="uppercase text-white text-sm tracking-wider mt-1"> 
                        {location === '/dashboard'
                            ? 'Dashboard'
                            : location.toUpperCase().replace('/', '') 
                        }

                    </h4>

                    <div className="flex"> 

                        <NavbarInput placeholder="Search" className="hidden"/>

                        <div className="-mr-4 ml-6">
                            <Dropdown
                                color="transparent"
                                buttonText={
                                    <div className="w-12">
                                        <Avatar>{user.email[0]}</Avatar>
                                    </div>
                                }
                                rounded
                                style={{
                                    padding: 0,
                                    color: 'transparent',
                                }}
                            >
                                <DropdownItem color="lightBlue">
                                    Profile
                                </DropdownItem>
                                <DropdownItem color="lightBlue">
                                    Settings
                                </DropdownItem>
                                <DropdownItem color="lightBlue" onClick={Logout}>
                                    Logout
                                </DropdownItem>
                            </Dropdown>
                        </div>
                        
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default AdminNavbar;
