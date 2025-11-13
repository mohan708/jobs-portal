import React, { useContext } from 'react'
import {assets} from "../assets/assets"
import { useClerk,UserButton,useUser } from '@clerk/clerk-react'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
  const {setShowRecruiterLogin} = useContext(AppContext)
  const navigate = useNavigate();
    const {openSignIn} = useClerk();
       const {user} = useUser();
    return (
    <div className='shadow py-4'>
        <div className='container px-4 2xl:px-20 mx-auto  flex justify-between items-center'>
          
                <img onClick={()=> navigate('/')} className='cursor-pointer' src={assets.logo} alt="" />
                 {
                    user ?  <div className='flex item-center gap-4'>
                                <Link to={'/application'}> Applied Jobs</Link>
                                <p>|</p>
                                <p className='max-sm:hidden'>Hi {user.firstName+" "+user.lastName}</p>
                               <UserButton />
                          </div>

                    :  
                   <div className='flex gap-6 max-sm:text-xs'>
                   <button onClick={()=>setShowRecruiterLogin(true)}  className='text-gray-600 cursor-pointer'>Recruiter Login</button>
                   <button className='bg-blue-600 px-6 sm:px-8 text-white  py-2 rounded-full' onClick={e => openSignIn() }>Login</button>
               </div>

}          
        </div>
    </div>
  )
}

export default Navbar

// import React from "react";
// import { assets } from "../assets/assets";
// import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
// import { Link } from "react-router-dom";

// const Navbar = () => {
//   const { openSignIn } = useClerk();
//   const { user, isSignedIn } = useUser();

//   const handleSignIn = () => {
//     // Only open the modal if NOT signed in
//     if (!isSignedIn) {
//       openSignIn();
//     }
//   };

//   return (
//     <div className="shadow py-4">
//       <div className="container px-4 2xl:px-20 mx-auto flex justify-between items-center">
//         <img src={assets.logo} alt="logo" />

//         {isSignedIn ? (
//           <div className="flex items-center gap-4">
//             <Link to="/application" className="text-gray-700 hover:text-blue-600">
//               Applied Jobs
//             </Link>
//             <p>|</p>
//             <p>
//               Hi {user?.firstName} {user?.lastName}
//             </p>
//             <UserButton  />
//           </div>
//         ) : (
//           <div className="flex gap-6 max-sm:text-xs">
//             <button className="text-gray-600">Recruiter Login</button>
//             <button
//               className="bg-blue-600 px-6 sm:px-8 text-white py-2 rounded-full"
//               onClick={handleSignIn}
//             >
//               Login
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Navbar;


