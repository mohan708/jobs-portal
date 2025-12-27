import express from 'express'
import { ChangeJobApplicationStatus, changeVisibility, getCompanyData, getCompanyJobApplication, getCompanyPostedJobs, getCompanypostJob, loginCompany,  registerCompany } from "../controllers/companyController.js"
import upload from "../config/multer.js"
import { protectCompany } from '../middlreware/authMiddleware.js'


const router = express.Router()

// Register a company
router.post('/register',upload.single('image'), registerCompany)

// Company login
router.post('/login',loginCompany)

// get company data
router.get('/company',protectCompany, getCompanyData)

// post a Job
router.post('/post-job',protectCompany,getCompanypostJob)

// get applicants data from company 
router.get('/applicants',protectCompany, getCompanyJobApplication)

// get company job list 
router.get('/list-jobs',protectCompany, getCompanyPostedJobs)

// change application status
router.post('/change-status',protectCompany, ChangeJobApplicationStatus)

// change application visibility
router.post('/change-visibility',protectCompany, changeVisibility)

export default router