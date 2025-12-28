import React, { useContext, useEffect, useState } from 'react'
import { manageJobsData } from '../assets/assets'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import Loading from '../components/Loading'


const ManageJobs = () => {
    const navigate = useNavigate();

    // const [jobs, setJobs] = useState(false)
       const [jobs, setJobs] = useState([])
    console.log("data",jobs)
    



    const { backend_url, companyToken } = useContext(AppContext)

    // function to fetch company job application data

    const fetchCompanyJobs = async () => {
        try {
            const { data } = await axios.get(backend_url + '/api/company/list-jobs', { headers: { token: companyToken } })
            console.log(data)
            if (data.success) {
                setJobs(data.jobsData.reverse())
                console.log(data.jobsData)
            }
            else {
                toast.error(data.message)
                console.log(data)
            }

        } catch (error) {
            toast.error(error.message)

        }
    }

    // funcition to change job visibility

    const changeJobVisibility = async (id) => {

        try {

            const { data } = await axios.post(backend_url + '/api/company/change-visibility', { id }, { headers: { token: companyToken } })

            if (data.success) {
                toast.success(data.message)
                fetchCompanyJobs()
            }
            else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }

    }

    useEffect(() => {
        if (companyToken) {
            fetchCompanyJobs()
        }
    }, [companyToken])

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
                        {jobs && jobs.map((job, index) => (
                            <tr key={index} className='border-b  border-gray-200 text-gray-700'>
                                <td className='py-2 px-4 max-sm:hidden '>{index + 1}</td>
                                <td className='py-2 px-4  '>{job.title}</td>
                                <td className='py-2 px-4 max-sm:hidden '>{moment(job?.date).format('ll')}</td>
                                {/* <td className='py-2 px-4 max-sm:hidden '>
                                    {job?.date
                                        ? moment(typeof job.date === 'number' ? job.date : new Date(job.date)).format('ll')
                                        : 'N/A'}
                                </td> */}
                                <td className='py-2 px-4 max-sm:hidden '>{job.location}</td>
                                <td className='py-2 px-4 text-center ' >{job.application}</td>
                                <td className='py-2 px-4  text-center'>
                                    <input type="checkbox" className='scale-125' checked={job?.visible} onChange={() => changeJobVisibility(job._id)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className='mt-5 flex justify-end'>
                    <button onClick={() => navigate('/dashboard/add-job')} className='bg-black cursor-pointer text-white py-2 px-4 rounded'>Add new Job</button>
                </div>
            </div>
        </div>
    ) : <Loading />
}
export default ManageJobs




// import React, { useContext, useEffect, useState } from 'react';
// import moment from 'moment';
// import { useNavigate } from 'react-router-dom';
// import { AppContext } from '../context/AppContext';
// import { toast } from 'react-toastify';
// import axios from 'axios';
// import Loading from '../components/Loading';

// const ManageJobs = () => {
//   const navigate = useNavigate();
//   const { backend_url, companyToken } = useContext(AppContext);
//   const [jobs, setJobs] = useState([]); // ✅ Initialize as empty array

//   // Helper function to safely format date
//   const formatJobDate = (job) => {
//     if (!job?.date) return 'N/A';
//     return moment(typeof job.date === 'number' ? job.date : new Date(job.date)).format('ll');
//   };

//   // Fetch company jobs
//   const fetchCompanyJobs = async () => {
//     try {
//       const { data } = await axios.get(backend_url + '/api/company/list-jobs', {
//         headers: { token: companyToken }
//       });

//       if (data.success) {
//         setJobs(Array.isArray(data.jobsData) ? data.jobsData.reverse() : []);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   // Change job visibility
//   const changeJobVisibility = async (id) => {
//     if (!id) return;
//     try {
//       const { data } = await axios.post(
//         backend_url + '/api/company/change-visibility',
//         { id },
//         { headers: { token: companyToken } }
//       );

//       if (data.success) {
//         toast.success(data.message);
//         fetchCompanyJobs();
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   useEffect(() => {
//     if (companyToken) {
//       fetchCompanyJobs();
//     }
//   }, [companyToken]);

//   if (!jobs) return <Loading />;

//   // No jobs fallback
//   if (jobs.length === 0)
//     return (
//       <div className='flex items-center justify-center h-[70vh]'>
//         <p className='text-xl sm:text-2xl'>No jobs available or posted</p>
//       </div>
//     );

//   return (
//     <div className='container p-4 max-w-5xl'>
//       <div className='overflow-x-auto'>
//         <table className='min-w-full bg-white border border-gray-200 max-sm:text-sm'>
//           <thead>
//             <tr className='border-b border-gray-200'>
//               <th className='py-2 px-4 text-left max-sm:hidden'>#</th>
//               <th className='py-2 px-4 text-left'>Job Title</th>
//               <th className='py-2 px-4 text-left max-sm:hidden'>Date</th>
//               <th className='py-2 px-4 text-left max-sm:hidden'>Location</th>
//               <th className='py-2 px-4 text-center'>Applicant</th>
//               <th className='py-2 px-4 text-left'>Visible</th>
//             </tr>
//           </thead>
//           <tbody>
//             {Array.isArray(jobs) &&
//               jobs.map((job, index) => (
//                 <tr key={job._id || index} className='border-b border-gray-200 text-gray-700'>
//                   <td className='py-2 px-4 max-sm:hidden'>{index + 1}</td>
//                   <td className='py-2 px-4'>{job?.title || 'N/A'}</td>
//                   <td className='py-2 px-4 max-sm:hidden'>{formatJobDate(job)}</td>
//                   <td className='py-2 px-4 max-sm:hidden'>{job?.location || 'N/A'}</td>
//                   <td className='py-2 px-4 text-center'>{job?.application ?? 0}</td>
//                   <td className='py-2 px-4 text-center'>
//                     <input
//                       type='checkbox'
//                       className='scale-125'
//                       checked={job?.visible ?? false}
//                       onChange={() => changeJobVisibility(job?._id)}
//                     />
//                   </td>
//                 </tr>
//               ))}
//           </tbody>
//         </table>

//         <div className='mt-5 flex justify-end'>
//           <button
//             onClick={() => navigate('/dashboard/add-job')}
//             className='bg-black cursor-pointer text-white py-2 px-4 rounded'
//           >
//             Add new Job
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManageJobs;
