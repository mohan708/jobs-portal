// Register a new company 
import Company from "../models/Company.js";
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import generateToken from "../utils/generateToken.js";
import Job from "../models/jobs.js";
import jobApplicaton from "../models/jobApplication.js";

export const registerCompany = async (req, res) => {

    const { name, email, password } = req.body

    const imageFile = req.file;


    if (!name || !email || !password || !imageFile) {
        return res.json({ success: false, message: "missing Details" })
    }

    try {
        const companyExists = await Company.findOne({ email })

        if (companyExists) {
            return res.json({ success: false, message: "company already register" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const imageUpload = await cloudinary.uploader.upload(imageFile.path)
        const company = await Company.create({
            name,
            email,
            password: hashPassword,
            image: imageUpload.secure_url
        })

        res.json({
            success: true,
            company:
            {
                _id: company._id,
                name: company.name,
                email: company.email,
                image: company.image
            },
            token: generateToken(company._id),
            message: 'Sucessfully Regiter'
        })
    }
    catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Company login 

export const loginCompany = async (req, res) => {


    const { email, password } = req.body;

    try {

        const company = await Company.findOne({ email })

        if (await bcrypt.compare(password, company.password)) {
            res.json({
                success: true,
                company:
                {
                    _id: company._id,
                    name: company.name,
                    email: company.email,
                    image: company.image
                },
                token: generateToken(company._id),
                message: 'Sucessfully Login'


            })
        }

        else {
            res.json({ success: false, message: 'invalid email or password' })
        }

    } catch (error) {
        res.json({ success: false, message: error.message })

    }

}

// get company data

export const getCompanyData = async (req, res) => {

    try {
        const company = req.company
        res.json({ success: true, company })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })

    }

}


// post a new job

export const getCompanypostJob = async (req, res) => {

    const { title, description, location, salary, level, category } = req.body;
    const companyId = req.company._id

    try {

        const newJob = new Job({
            title,
            description,
            location,
            salary,
            companyId,
            date: Date.now(),
            level,
            category
        })

        await newJob.save()

        return res.json({ success: true, newJob })

    } catch (error) {

        res.json({ success: false, message: error.message })

    }

}

// get company job applicant 

export const getCompanyJobApplication = async (req, res) => {
    try {
        const companyId = req.company._id

        const applications = await jobApplicaton.find({ companyId })
            .populate('userId', 'name image resume')
            .populate('jobId', 'title location category level salary')
            .exec()



        return res.json({ success: true, applications })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// get Company posted jobs

export const getCompanyPostedJobs = async (req, res) => {

    try {

        const companyId = req.company._id
        const jobs = await Job.find({ companyId })

        // (To Do) Adding No of applicants info in data
        const jobsData = await Promise.all(jobs.map(async (job) => {
            const applicants = await jobApplicaton.find({ jobId: job._id });
            return { ...job.toObject(), application: applicants.length }
        }))

        res.json({ success: true, jobsData })

    } catch (error) {
        res.json({ success: false, message: error.message })

    }

}

// change job application status 

export const ChangeJobApplicationStatus = async (req, res) => {


    try {

        const { id, status } = req.body
        // find job application and update status

        await jobApplicaton.findOneAndUpdate({ _id: id }, { status })

        res.json({ success: true, message: "Status changed" })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }





}

// change job visibility 

export const changeVisibility = async (req, res) => {

    try {
        const { id } = req.body
        const companyId = req.company._id
        const job = await Job.findById(id)

        console.log("Logged company:", companyId.toString());
        console.log("Job owner:", job.companyId.toString());
        console.log("Match:", companyId.toString() === job.companyId.toString());
        console.log("Current visible:", job.visible);

        if (companyId.toString() === job.companyId.toString()) {
            job.visible = !job.visible

            console.log("New visible:", job.visible);
            console.log("Type of visible:", typeof job.visible);


        }



        await job.save()
        res.json({ success: true, job })

    } catch (error) {
        res.json({
            success: false, message: error.message
        })
    }
}