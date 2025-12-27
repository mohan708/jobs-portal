import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import Loading from '../components/Loading';
import Navbar from '../components/Navbar';
import { assets, jobsData } from '../assets/assets';
import kconvert from 'k-convert';
import moment from 'moment';
import JobsCard from '../components/JobsCard';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';


const ApplyJobs = () => {
  const { id } = useParams()

  const {getToken} = useAuth(); 

  const navigate = useNavigate();

  const [jobData, setJobData] = useState(null);
  const [isAlreadyApplied,setIsAlreadyApplied] = useState(false); 

  const {jobs,backend_url,userData,userApplications, fetchUserApplication} = useContext(AppContext)

  const fetchJob = async() => {
     
    try {
    const {data} = await axios.get(backend_url+ `/api/jobs/${id}`)
    // console.log("Job Data will:", data.job)
    if(data.success){
      setJobData(data.job)
      // console.log("Job Data will:", data.job)
    } 
    else{
      toast.error(data.message)
    }
    }
    catch(error) {
        toast.error(error.message)
    }
    
  }

  const applyHandler = async()=>{
    try {

      if(!userData)
      {        
        return toast.error("Please login to apply for the job")
      }
      
      if(!userData.resume){
       navigate('/application')
        return toast.error("Please update your resume to apply for the job")
      }

      const token = await getToken();;

      const {data} = await axios.post(backend_url+'/api/users/apply',{jobId:jobData._id},{headers:{Authorization:`Bearer ${token}`}})

      if(data.success){
        toast.success(data.message)
      }
      else{
        toast.error(data.message)
      }

      

    } catch (error) {
      toast.error(error.message)
    }
  }

  const checkAlreadyApplied = () =>{
    const hasApplied = userApplications.some(item => item.jobId._id === jobData._id)
    console.log("Has applied:", hasApplied)

    setIsAlreadyApplied(hasApplied);

  }

  useEffect(() => {
    
      fetchJob();
    

  }, [id])

  useEffect(()=>{
     console.log("🟦 USER APPLICATIONS:", userApplications);
  console.log("🟧 JOB DATA:", jobData);
 if(userApplications?.length > 0 && jobData){
    checkAlreadyApplied();
 }
 

  },[jobData,userApplications,id])

  return jobData ? (
    <>
      <Navbar />


      <div className='container min-h-screen px-4 flex flex-col py-10 2xl:px-20 mx-auto'>
        <div className='bg-white text-black rounded-lg w-full'>
          <div className='flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20 mb-6 bg-sky-50 border border-sky-400 rounded-xl'>
            <div className='flex flex-col md:flex-row items-center'>
              <img className='h-24 p-4 max-md:mb-4  border bg-white rounded-xl' src={jobData.companyId.image} alt="" />
              <div className='text-center md:text-left md:ml-6 text-neutral-700'>
                <h1 className='text-2xl sm:text-4xl font-medium '>{jobData.title}</h1>
                <div className='flex flex-row flex-wrap max-md:justify-center gap-y-2 gap-6 items-center text-gray-600 mt-2'>
                  <span className='flex items-center gap-1'>
                    <img src={assets.suitcase_icon} alt="" />
                    {jobData.companyId.name}
                  </span>
                  <span className='flex items-center gap-1'>
                    <img src={assets.location_icon} alt="" />
                    {jobData.location}
                  </span>
                  <span className='flex items-center gap-1'>
                    <img src={assets.person_icon} alt="" />
                    {jobData.level}
                  </span>
                  <span className='flex items-center gap-1'>
                    <img src={assets.money_icon} alt="" />
                    CTC: {kconvert.convertTo(jobData.salary)}
                  </span>
                </div>
              </div>
            </div>

            <div className='flex flex-col justify-center text-end text-sm max-md:mx-auto max-md:text-center '>
              <button className='bg-blue-600 p-2.5 px-10 text-white rounded' onClick={applyHandler} >{isAlreadyApplied ? 'Already Applied': 'Apply Nows'}</button>
              <p className='mt-1 text-gray-600'>Posted: {moment(jobData.date).fromNow()}</p>
            </div>
          </div>

          <div className='flex flex-col lg:flex-row justify-between items-start'>
            <div className='w-full lg:w-2/3'>
              <h2 className='font-bold text-2xl mb-4'>Job description</h2>
              <div className='flex flex-col gap-6 rich-text' dangerouslySetInnerHTML={{ __html: jobData.description }}></div>
              <button className='bg-blue-600 p-2.5 px-10 text-white rounded mt-10' onClick={applyHandler} >{isAlreadyApplied ? 'Already Applied' : 'Apply Nows'}</button>
            </div>

            {/* right side data */}

            <div className='w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5'>
              <h2>More Jobs from {jobData.companyId.name}</h2>
              {jobs.filter(job => job._id !== jobData._id && job.companyId._id === jobData.companyId._id)
                .filter(job => {
                  // set of applied jobsIds
                  const appliedJobsIds =   new Set(userApplications.map(item => item.jobId && item.jobId._id));

                  // return only jobs which are not applied yet
                  return !appliedJobsIds.has(job._id);
                })
                .slice(0, 4)
                .map((job, index) => <JobsCard key={index} job={job} />)}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  ) :
    (
      <Loading />
    )
}

export default ApplyJobs;