// import nongoose from  'mongoose';
import Company from './Company.js';
import mongoose from 'mongoose';

const JobApplicationSchema = new mongoose.Schema({
    userId:{type:String, ref:'User', required:true},
    companyId:{type: mongoose.Schema.Types.ObjectId, ref:'Company', required:true},
    jobId:{type:mongoose.Schema.Types.ObjectId, ref:'Job', required:true},
    status:{type:String, default:'pending'},
    date:{type:Number, required:true}

})

const jobApplicaton = mongoose.model('jobApplication', JobApplicationSchema)

export default jobApplicaton