import React, { useEffect, useRef, useState } from 'react'
import Quill from 'quill';
import { JobCategories, JobLocations } from '../assets/assets';
import JobListing from '../components/JobListing';

const AddJob = () => {

    const [title,setTitle] =useState('');
    const [location,setLocation]= useState('Banglore');
    const [category,setCatyegory] =useState('Programming');
    const [level,setLevel] =useState("Beginner level")
    const [salary,setSalary] = useState(0);

    const editorRef = useRef(null)
    const quillRef = useRef(null) 

    useEffect(()=>{
        // initiate quill only once

        if(!quillRef.current && editorRef.current){
           quillRef.current = new Quill(editorRef.current ,{
            theme:'snow',
           })
        }
    },[])

  return (
      <form className='conatiner p-4 flex flex-col w-full items-start gap-3'>
        <div className='w-full '>
            <p className='mb-2'>Job Title</p>
            <input type="text" placeholder='Type here' 
            value={title}
            onChange={e => setTitle(e.target.value) }
            className='w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded' 
            />
        </div>

        <div  className='w-full max-w-lg'>
            <p className='my-2'>Job Description</p>
            <div ref={editorRef}></div>
        </div>

        <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
            <div>
                <p className='mb-2'>Job Category</p>
                <select className='w-full px-3 mt-1  py-2 border-2 border-gray-300 rounded' onChange={e => setCatyegory(e.target.value)}>
                    {JobCategories.map((category,index)=>(
                        <option className='mt-4' key={index} value={category}>{category}</option>
                    ))}

                </select>
            </div>

            <div>
                <p className='mb-2'>Job Location</p>
                <select  className='w-full  px-3 py-2 border-2 border-gray-300 rounded' onChange={e => setLocation(e.target.value)}>
                    {JobLocations.map((location,index)=>(
                        <option c key={index} value={location}>{location}</option>
                    ))}

                </select>
            </div>

            <div>
                <p className='mb-2'>Job Level</p>
                <select  className='w-full px-3   py-2 border-2 border-gray-300 rounded' onChange={e => setLevel(e.target.value)}>
                    <option value="Beginner level">Beginner level</option>
                    <option value="Intermediate level">Intermediate level</option>
                    <option value="Senior level">Senior level</option>
                </select>
            </div>
        </div>

        <div>
            <p className='mb-2'>Job salary</p>
            <input min={0} className='w-full px-3   py-2 border-2 border-gray-300 rounded sm:w-[120px]'   type="Number" placeholder='2500' onChange={e => setSalary(e.target.value)} />
        </div>

       <button className=' py-3 w-28 mt-4 bg-black text-white rounded'>Add</button>

      </form>
  )
}

export default AddJob