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
import { clerkWebhooks } from './controllers/webhooks.js'



// initialize express

const app= express()

// connect to database

await connectDB()
await connectCloudinary()


// Verify environment variables
console.log("=== ENVIRONMENT CHECK ===")
console.log("Clerk Publishable Key:", process.env.CLERK_PUBLISHABLE_KEY ? "✅" : "❌")
console.log("Clerk Secret Key:", process.env.CLERK_SECRET_KEY ? "✅" : "❌")
console.log("Clerk Webhook Secret:", process.env.CLERK_WEBHOOK_SECRET ? "✅" : "❌")
console.log("========================")

// Critical check
if (!process.env.CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) {
  console.error("❌ CRITICAL: Missing Clerk keys!")
  console.error("Get them from: https://dashboard.clerk.com/last-active?path=api-keys")
  process.exit(1)
}



// middleware 
app.post('/webhooks', express.raw({type: 'application/json', limit: '5mb'}), clerkWebhooks)

app.use(cors())
app.use(express.json())

// Apply `clerkMiddleware()` to all routes
// app.use(clerkMiddleware(
//     {
//   publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
//   secretKey: process.env.CLERK_SECRET_KEY,
//     }
// ))


app.use((req, res, next) => {
  // Skip Clerk for static files
  if (req.path.match(/\.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$/)) {
    return next()
  }
  
  // Apply Clerk to everything else
  clerkMiddleware({
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.CLERK_SECRET_KEY,
  })(req, res, next)
})

// Routes
app.get('/', (req,res)=>res.send("api working"))

app.get("/debug-sentry", function mainHandler(req, res) {
//   throw new Error("My first Sentry error!");
});

app.use('/api/company', companyRoutes)
app.use('/api/jobs',jobRoutes)
app.use('/api/users',userRoutes)



const PORT = process.env.PORT || 8080

// sentry
Sentry.setupExpressErrorHandler(app);

// Optional fallthrough error handler

console.log("🟢 Sentry error handler configured.");
console.log("🟢 All systems configured")



app.listen(PORT, ()=>{
    console.log(`server is running ${PORT}`)
})
