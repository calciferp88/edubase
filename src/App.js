import React, { useEffect } from 'react';
import './styles/global.css';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import '@material-tailwind/react/tailwind.css';

import LoginFirst from './pages/LoginFirst';
import Dashboard from './pages/dashboard/Dashboard';
import Mails from './pages/dashboard/Mails';
import Categories from './pages/dashboard/Categories';
import Departments from './pages/dashboard/Departments';
import Home from './pages/newsfeed/Home';
import IdeaDetail from './pages/newsfeed/IdeaDetail';
import Pagenotfound from './pages/Pagenotfound';
import DepartmentEdit from './pages/dashboard/DepartmentEdit';
import AdminStaffs from './pages/dashboard/AdminStaffs';
import AdminStaffEdit from './pages/dashboard/AdminStaffEdit';
import CategoryEdit from './pages/dashboard/CategoryEdit';
import CategoryPublish from './pages/dashboard/CategoryPublish';
import Share from './pages/newsfeed/Share';
import CategoryDetail from './pages/dashboard/CategoryDetail';
import GeneralStaffs from './pages/dashboard/GeneralStaffs';
import GeneralStaffEdit from './pages/dashboard/GeneralStaffEdit';
import Login from './pages/Login';

import { useDispatch, useSelector } from 'react-redux'; //redux
import { login, logout, selectUser } from './features/userSlice';
import { auth } from "./config";
import IdeaEdit from './pages/newsfeed/IdeaEdit';
import Trending from './pages/newsfeed/Trending';
import Ideas from './pages/dashboard/Ideas';
import Notifications from './pages/newsfeed/Notifications';



function App() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser); // user from state
  // authentication state change
  useEffect(() => {
    auth.onAuthStateChanged((userAuth) =>{
      if(userAuth){
        dispatch(login({
          email: userAuth.email,
          uid: userAuth.uid,
          displayName: userAuth.displayName,
        }));
      }
      else{
        dispatch(logout());
      }
    })
  }, []);

  // navigate
  // useEffect(() => {
  //   if(!user){
  //     navigate("/login");
  //   }
  // }, [user]);


  return (
    <div> 
      <Routes>

        {
          !user ? (
              <>
                <Route path="/login" element={<Login/>} />
                <Route path="/*" element={<LoginFirst/>} />
              </>
            ) : (
              
              <>  
                <Route path='/' element={<Home/>} />
                <Route path="/share" element={<Share/>} />
                <Route path="/notifications" element={<Notifications/>} />
                <Route path="/explore" element={<Trending/>} />
                <Route path="/idea/:ideaId" element={<IdeaDetail/>} />
                <Route path="/edit" element={<IdeaEdit/>} />

                <Route path="/ideas" element={<Ideas/>} />

                <Route path='/dashboard' element={<Dashboard/>} />
                <Route path='/categories' element={<Categories/>} />
                <Route path='/category-edit' element={<CategoryEdit/>} />
                <Route path="/category-publish" element={<CategoryPublish/>} />
                <Route path="/category-detail" element={<CategoryDetail/>} />
                <Route path="/departments" element={<Departments/>} />
                <Route path="/dept-edit" element={<DepartmentEdit/>} />
                <Route path="/admin-staffs" element={<AdminStaffs/>} />
                <Route path="/admin-staffs-edit" element={<AdminStaffEdit/>} />
                <Route path="/general-staffs" element={<GeneralStaffs/>} />
                <Route path='/general-staffs-edit' element={<GeneralStaffEdit/>} />
                <Route path="/mails" element={<Mails/>} />
        
        
                <Route path="/*" element={<Pagenotfound/>} />
              </>

          )
        }

      </Routes>
    </div>
  );
}

export default App;


// Role-based system logic
// QAM, QAC => dashboard 
// default ---> QAM 
// QAM => deaprtment, QAC
// QAM => Categories -> publish 
// QAC => general staff ........

// QAM => *
// QAC => dashboard, general staff
