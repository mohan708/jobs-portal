import React, { useContext, useEffect,useState } from 'react'
import { manageJobsData } from '../assets/assets'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import Loading from '../components/Loading'


const ManageJobs = () => {
    const navigate = useNavigate();

    const[jobs,setJobs]= useState(false)

     
    const {backend_url,companyToken} = useContext(AppContext)

    // function to fetch company job application data

    const fetchCompanyJobs = async()=>{
        try {
            const{data} = await axios.get(backend_url+'/api/company/list-jobs',{headers:{token:companyToken}})
            console.log(data)
            if(data.success){
                setJobs(data.jobsData.reverse())
                console.log(data.jobsData)
            }
            else{
                toast.error(data.message)
                console.log(data)
            }

        } catch (error) {
            toast.error(error.message)
            
        }
    }

    // funcition to change job visibility

    const changeJobVisibility = async(id)=>{

        try {

            const {data} = await axios.post(backend_url+'/api/company/change-visibility',{id},{headers:{token:companyToken}})

            if(data.success){
                toast.success(data.message)
                fetchCompanyJobs ()
            }
            else{
                toast.error(data.message)
            }
            
        } catch (error) {
            toast.error(error.message)
        }

    }

    useEffect(()=>{
         if(companyToken){
           fetchCompanyJobs() 
         }
    },[companyToken])

  return jobs ? jobs.length === 0 ? (<div className='flex items-center justify-center h-[70vh]'>
    <p className='text-xl sm:text-2xl'>No jobs Available or posted</p>
  </div>) : (
    <div className='container p-4 max-w-5xl'>
        <div className='overflow-x-auto'>
            <table className='min-w-full bg-white border border-gray-200 max-sm:text-sm'>
                <thead>
                    <tr className='border-b  border-gray-200'>
                        <th className='py-2 px-4 text-left max-sm:hidden'>#</th>
                        <th className='py-2 px-4 text-left'>Job Title</th>
                        <th className='py-2 px-4 text-left max-sm:hidden'>Date</th>
                        <th className='py-2 px-4 text-left max-sm:hidden'>Location</th>
                        <th className='py-2 px-4 text-center'>Applicant</th>
                        <th className='py-2 px-4 text-left'>Visible</th>
                    </tr>
                </thead>
                <tbody>
                    {jobs && jobs.map((job,index)=>(
                        <tr key={index} className='border-b  border-gray-200 text-gray-700'>
                            <td className='py-2 px-4 max-sm:hidden '>{index+1}</td>
                            <td className='py-2 px-4  '>{job.title}</td>
                            <td className='py-2 px-4 max-sm:hidden '>{moment(job.date).format('ll')}</td>
                            <td className='py-2 px-4 max-sm:hidden '>{job.location}</td>
                            <td className='py-2 px-4 text-center ' >{job.application}</td>
                            <td className='py-2 px-4  text-center'>
                                <input type="checkbox" className='scale-125'  checked={job.visible} onChange={()=> changeJobVisibility(job._id)}/>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className='mt-4 flex justify-end'>
                <button onClick={()=>navigate('/dashboard/add-job')}  className='bg-black cursor-pointer text-white py-2 px-4 rounded'>Add new Job</button>
            </div>
        </div>
    </div>
  ) : <Loading /> 
}

export default ManageJobs