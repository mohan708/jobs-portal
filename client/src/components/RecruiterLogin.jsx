import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const RecruiterLogin = () => {

  const {setShowRecruiterLogin} = useContext(AppContext)
    const [state,setState] = useState('Login')
    const [name,setName] =useState('')
    const [password,setPassword] =useState('')
    const [email,setEmail] =useState('')

    const [image,setImage] = useState(false);
    const [isTextDataSubmitted,setIsTextDataSubmitted] = useState(false);

    const onSubmitHandler = async (e)=>{
      e.preventDefault()

      if(state == 'Sign Up' && !isTextDataSubmitted ){
        setIsTextDataSubmitted(true)
      }
    }

    useEffect(()=>{
         document.body.style.overflow= 'hidden'
         return ()=>{
          document.body.style.overflow = 'unset'
         }
    },[])

  return (
   <div className='absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
    <form onSubmit={onSubmitHandler} className='relative bg-white p-10 rounded-xl text-slate-500 '>
    
    <h1 className='text-center text-2xl text-neutral-700 font-medium'>Recuriter {state}</h1>
    <p className='text-sm'>Welcome back! Please sign in to continue</p>

     { state === 'Sign Up' && isTextDataSubmitted ? 
     <>
     <div className='flex items-center gap-4 my-10'>
      <label htmlFor="image">
        <img className='w-16 rounded-full' src={ image ? URL.createObjectURL(image) :  assets.upload_area} alt="" />
        <input onChange={e=> setImage(e.target.files[0])} type="file" id='image' hidden />
      </label>
      <p>Upload Company <br />logo</p>
     </div>
     </>
     :

      
    <>

     {state !== "Login" && (<div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
      <img src={assets.person_icon} alt="" />
      <input className='outline-none text-sm' onChange={e => setName(e.target.value)} value={name} type="text" placeholder='Company Name' required/>
    </div>)}

    

    <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
      <img src={assets.email_icon} alt="" />
      <input className='outline-none text-sm' onChange={e => setEmail(e.target.value)} value={email} type="email" placeholder='Email Id' required/>
    </div>

    <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
      <img src={assets.lock_icon} alt="" />
      <input className='outline-none text-sm' onChange={e => setPassword(e.target.value)} value={password} type="password" placeholder='Password' required/>
    </div>
    </>
     
    }


    {state === 'Login' && (<p className='mt-2 text-sm text-blue-600 cursor-pointer' >Forget password?</p>
)}

    <button type='submit' className='bg-blue-600 w-full text-white py-2 mt-5 rounded-full'>
      {state === "Login" ? "Login" : isTextDataSubmitted ? "Create Account" : "Next"}
    </button>

    {
      state === 'Login' ? <p className='mt-4 text-center text-sm'>Dont't have an account?  <span onClick={()=> setState('Sign Up')} className='text-blue-500 cursor-pointer'>Sign Up</span></p> 
      :  <p className='mt-4 text-center text-sm'> Already have an account?<span onClick={()=> setState('Login')} className='cursor-pointer text-blue-500'>Login</span></p>
    }

  
   <img src={assets.cross_icon}  onClick={()=>setShowRecruiterLogin(false)} className='absolute top-5 right-5 cursor-pointer' alt="" />

    </form>
   </div>
  )
}   

export default RecruiterLogin