import React,{useState} from 'react'
import Navbar from '../components/Navbar'
import { assets, jobsApplied } from '../assets/assets';
import moment from 'moment';
import Footer from '../components/Footer';

const Application = () => {
  const [isEdit,setIsEdit] = useState(false);
  const [resume,setResume] =useState(null); 
  return (
   <>
   <Navbar />
   <div className='container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10'>
    <h2 className='text-xl font-semibold'>Your Resume</h2>
    <div className='flex gap-2 mb-6 mt-3'>
      {
        isEdit ? 
        <>
        <label className='flex items-center' htmlFor="resumeUpload">
          <p className='bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mr-2'>Select Resume</p>
          <input id='resumeUpload' onChange = {e => setResume(e.target.files[0])} accept='application/pdf' type='file' hidden/>
          <img src={assets.profile_upload_icon} alt="" />
        </label>
        <button onClick={()=> setIsEdit(false)} className='bg-green-100 border border-green-400 px-4 py-2 rounded-lg mr-2'>save</button>
        </>
        :
        <div className='flex gap-2'> 
          <a href="" className='bg-blue-100 tex-blue-600 px-4 py-2 rounded-lg cursor-pointer '>
            Resume
          </a>
          <button onClick={()=>setIsEdit(true)}  className='bg-white tex-gray-600 px-4 py-2 rounded-lg border border-gray-300 cursor-pointer'>
            Edit
          </button>

          </div>


      }
    </div>
    <h2 className='text-xl font-semibold mb-4'>Jobs Applied</h2>
    <table className='min-w-full bg-white border border-gray-300  rounded-lg '> 
      <thead>
        <tr>
          <th className='py-3 px-4 border-b border-gray-300 text-left '>Company</th>
          <th className='py-3 px-4 border-b border-gray-300 text-left'> Job Title</th>
          <th className='py-3 px-4 border-b border-gray-300 text-left max-sm:hidden'>Location</th>
          <th className='py-3 px-4 border-b border-gray-300 text-left max-sm:hidden'> Date</th>
          <th className='py-3 px-4 border-b border-gray-300 text-left'> Status</th>
        </tr>
      </thead>
      <tbody>
        {jobsApplied.map((job,index)=> true ? (
          <tr>
            <td className='py-3 px-4  border-b  border-gray-300'>
              <div className='flex items-center gap-2'>
              <img className='w-8 h-8' src={job.logo} alt="" />
             <span className='leading-none'> {job.company} </span>
             </div> 
            </td>
            <td className='py-2 px-4 border-b border-gray-300'>{job.title}</td>
            <td className='py-2 px-4 border-b border-gray-300 max-sm:hidden'>{job.location}</td>
            <td className='py-2 px-4 border-b border-gray-300 max-sm:hidden'>{moment(job.date).format('ll') }</td>
            <td className='py-2 px-4 border-b border-gray-300'>

              <span className={`${job.status === 'Accepted' ? 'bg-green-100' : job.status === 'Rejected' ? 'bg-red-100' : 'bg-blue-100' } px-4 py-1 rounded`}>{job.status}</span>
              
              </td>
          </tr>
        ) : (null))}
      </tbody>
    </table>
   </div>

   <Footer />
   </>
  )
}

export default Application