import './config/instrument.js'
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'
import * as Sentry from "@sentry/node"
import {clerkWebhooks} from './controllers/webhooks.js'

// initialize express

const app= express()

// connect to database

await connectDB()

// middleware 

app.use(cors())
app.use(express.json())

// Routes
app.get('/', (req,res)=>res.send("api working"))

app.get("/debug-sentry", function mainHandler(req, res) {
//   throw new Error("My first Sentry error!");
});
app.post('/webhooks',clerkWebhooks)

// port 8080

const PORT = process.env.PORT || 8080

// sentry
Sentry.setupExpressErrorHandler(app);

// Optional fallthrough error handler




app.listen(PORT, ()=>{
    console.log(`server is running ${PORT}`)
})
