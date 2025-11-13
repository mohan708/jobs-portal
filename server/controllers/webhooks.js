import { Webhook } from "svix";
import User from "../models/User.js";

// Api Controller function to Manage clerk user with database

export const clerkWebhooks = async (req,res)=>{

    try {
        // create a svik instance with clerk webhook secret.

         const whook = new Webhook (process.env.CLERK_WEBHOOK_SECRET)

        //  verifying Headers

        await whook.verify(JSON.stringify(req.body),{
            "svik-id" : req.headers["svik-id"],
            "svik-timestamp" : req.headers["svik-timestamp"],
            "svik-signature" : req.headers["svik-signture"]
        })

        // getting data from request body 

        const {data, type } = req.body

        // Switch case for different events

        switch(type){
            case 'user.created': {

                const userData = {
                    _id:data.id,
                    email: data.email.addressses[0].email_adsress,
                    name : data.first_name + " " + data.last_name,
                    image: data.image_url,
                    resume: ''
                }

                await User.create(userData)
                res.json({})
                    break;
                

            }

            case "user.updated":{

                 const userData = {
                    _id:data.id,
                    email: data.email.addressses[0].email_adsress,
                    name : data.first_name + " " + data.last_name,
                    image: data.image_url,
                    resume: ''
                }

                await User.findByIdAndUpdate(data.id, userData)
                res.json({})
                break

            }

            case "user.delete" :{
                await User.findByIdAndDelete(data.id)
                res.json({})
                break;
            }
        }

    } catch (error) {
        // verifying headers 
        console.log(error.message);
        res.json({success:false,message: 'webhooks Error' })
        
    }

}

