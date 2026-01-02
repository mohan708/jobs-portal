import './config/instrument.js'
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'
import * as Sentry from "@sentry/node"
// import {clerkWebhooks} from './controllers/webhooks.js'
import companyRoutes from './routes/companyRoutes.js'
import {connectCloudinary} from './config/cloudinarys.js'
import jobRoutes from './routes/jobRoutes.js'
import userRoutes from './routes/userRoutes.js'
import {clerkMiddleware} from '@clerk/express'
import { requireAuth } from "@clerk/express";



// initialize express

const app= express()

// connect to database

await connectDB()
await connectCloudinary()



// middleware 
app.post('/webhooks', express.raw({type: 'application/json', limit: '5mb'}), clerkWebhooks)

app.use(cors())
app.use(express.json())

// Apply `clerkMiddleware()` to all routes
app.use(clerkMiddleware())

// Routes
app.get('/', (req,res)=>res.send("api working"))

app.get("/debug-sentry", function mainHandler(req, res) {
//   throw new Error("My first Sentry error!");
});

app.post('/webhooks',clerkWebhooks)
app.use('/api/company', companyRoutes)
app.use('/api/jobs',jobRoutes)
app.use('/api/users',userRoutes)

// port 8080

const PORT = process.env.PORT || 8080

// sentry
Sentry.setupExpressErrorHandler(app);

// Optional fallthrough error handler

console.log("🟢 Sentry error handler configured.");


app.listen(PORT, ()=>{
    console.log(`server is running ${PORT}`)
})
