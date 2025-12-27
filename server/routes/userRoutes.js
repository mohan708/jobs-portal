import express from 'express'
import { applyForJob, getUserData, getUserJobApplication, updateUserResume } from '../controllers/userController.js'
import upload from '../config/multer.js'
import { requireAuth } from "@clerk/express";



const router = express.Router()

// Get user Data
router.get('/user',requireAuth(),getUserData)

// Apply for a job
router.post('/apply',requireAuth(),applyForJob)

// Get applied job data
router.get('/applications',getUserJobApplication)

// Update user profile (resume)
router.post('/update-resume',requireAuth(), upload.single('resume'),updateUserResume)


export default router