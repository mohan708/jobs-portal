import { createContext, useEffect, useState } from "react";
import { jobsData } from "../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth, useUser } from '@clerk/clerk-react'
// import { set } from "mongoose";

export const AppContext = createContext()

export const AppContextProvider = (props) => {

    const backend_url = import.meta.env.VITE_BACKEND_URL

    const { user } = useUser()
    const { getToken } = useAuth()

    const [searchFilter, setSearchFilter] = useState(
        {
            title: "",
            location: "",
        }
    )

    const [isSearched, setIsSearched] = useState(false)

    const [jobs, setJobs] = useState([])
    // fetch jobs data 

    const [showRecruiterLogin, setShowRecruiterLogin] = useState(false)

    // company data

    const [companyToken, setCompanyToken] = useState(null);
    const [companyData, setCompanyData] = useState(null);

    const [userData, setUserData] = useState(null)
    const [userApplications, setUserApplication] = useState([]);

    const fetchJobs = async () => {

        try {

            const { data } = await axios.get(backend_url + '/api/jobs')

            if (data.success) {
                setJobs(data.jobs)
                // console.log("Jobs Data :", data.jobs)
            }
            else {
                toast.error(data.message)
            }


        } catch (error) {
            toast.error(error.message)

        }
    }

    // fetch company data

    const fetchCompanyData = async () => {
        try {

            const { data } = await axios.get(backend_url + '/api/company/company', { headers: { token: companyToken } })
            // console.log("Company Data :", data)

            if (data.success) {
                setCompanyData(data.company)
                // console.log("Company Data :", data)
            }
            else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    // function to fetch user data

    const fetchUserData = async () => {
        try {

            const token = await getToken();

            const { data } = await axios.get(backend_url + '/api/users/user',
                { headers: { Authorization: `Bearer ${token}` } }
            )

            if (data.success) {
                setUserData(data.user)
            }
            else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }


    // function to fetch users applied application data

    const fetchUserApplication = async () => {
        try {

            const token = await getToken()

            const { data } = await axios.get(backend_url + '/api/users/applications',
                { headers: { Authorization: `Bearer ${token}` } }
            )

            if (data.success) {
                setUserApplication(data.applications)
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchJobs()
        // fetchCompanyData()

        const storedCompanyToken = localStorage.getItem('companyToken')
        if (storedCompanyToken) {
            setCompanyToken(storedCompanyToken)
        }
    }, [])

    useEffect(() => {
        if (companyToken) {
            fetchCompanyData()
        }

    }, [companyToken])

    useEffect(() => {
        if (user) {
            fetchUserData()
            fetchUserApplication()
        }
    }, [user])

    const value = {
        setSearchFilter, searchFilter,
        setIsSearched, isSearched,
        jobs, setJobs,
        showRecruiterLogin, setShowRecruiterLogin,
        companyToken, setCompanyToken,
        companyData, setCompanyData,
        backend_url,
        userData, setUserData,
        userApplications, setUserApplication,
        fetchUserData,
        fetchUserApplication

    }

    return (<AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>
    )
}
