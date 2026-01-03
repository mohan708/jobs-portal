// import { Webhook } from "svix";
// import User from "../models/User.js";

// export const clerkWebhooks = async (req, res) => {
//   try {
//     if (!req.body) {
//       return res.status(400).json({ success: false, message: "Empty body" });
//     }

//     const payload = req.body.toString("utf8");

//     const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

//     const evt = wh.verify(payload, {
//       "svix-id": req.headers["svix-id"],
//       "svix-timestamp": req.headers["svix-timestamp"],
//       "svix-signature": req.headers["svix-signature"],
//     });

//     const { data, type } = evt;

//     switch (type) {
//       case "user.created":
//       case "user.updated": {
//         await User.findByIdAndUpdate(
//           data.id,
//           {
//             _id: data.id,
//             email: data.email_addresses?.[0]?.email_address,
//             name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
//             image: data.image_url,
//             resume: "",
//           },
//           { upsert: true, new: true }
//         );
//         break;
//       }

//       case "user.deleted":
//         await User.findByIdAndDelete(data.id);
//         break;

//       default:
//         break;
//     }

//     return res.status(200).json({ success: true });
//   } catch (error) {
//     console.error("❌ Clerk webhook error:", error.message);
//     return res.status(400).json({ success: false, message: error.message });
//   }
// };




import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebhooks = async (req, res) => {
  try {
    console.log("=== WEBHOOK REQUEST RECEIVED ===");
    
    if (!req.body) {
      console.error("❌ Empty body received");
      return res.status(400).json({ success: false, message: "Empty body" });
    }

    // Verify webhook signature
    const payload = req.body.toString("utf8");
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    let evt;
    try {
      evt = wh.verify(payload, {
        "svix-id": req.headers["svix-id"],
        "svix-timestamp": req.headers["svix-timestamp"],
        "svix-signature": req.headers["svix-signature"],
      });
      console.log("✅ Signature verified successfully");
    } catch (verifyError) {
      console.error("❌ Webhook verification failed:", verifyError.message);
      return res.status(400).json({ 
        success: false, 
        message: "Webhook verification failed" 
      });
    }

    const { data, type } = evt;
    console.log(`📨 Processing event: ${type} for user: ${data.id}`);

    switch (type) {
      case "user.created":
      case "user.updated": {
        const userData = {
          _id: data.id,
          email: data.email_addresses?.[0]?.email_address,
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          image: data.image_url,
          resume: "",
        };

        console.log("💾 Saving user data:", userData);

        try {
          const result = await User.findByIdAndUpdate(
            data.id,
            userData,
            { upsert: true, new: true, runValidators: true }
          );
          console.log(`✅ User ${type} successful:`, result._id);
        } catch (dbError) {
          console.error("❌ Database error:", dbError.message);
          // Return 200 to prevent Clerk from retrying
          return res.status(200).json({ 
            success: false, 
            message: "Database error" 
          });
        }
        break;
      }

      case "user.deleted":
        try {
          await User.findByIdAndDelete(data.id);
          console.log(`✅ User deleted:`, data.id);
        } catch (dbError) {
          console.error("❌ Database delete error:", dbError.message);
          return res.status(200).json({ 
            success: false, 
            message: "Database error" 
          });
        }
        break;

      default:
        console.log(`ℹ️ Unhandled event type: ${type}`);
        break;
    }

    return res.status(200).json({ 
      success: true, 
      message: "Webhook processed successfully" 
    });

  } catch (error) {
    console.error("❌ Unexpected webhook error:", error.message);
    console.error("Stack trace:", error.stack);
    return res.status(400).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};
