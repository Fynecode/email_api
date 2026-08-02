import rateLimit from "express-rate-limit";


export const emailRateLimiter = rateLimit({

    windowMs: 15 * 60 * 1000, // 15 minutes

    max: 50, // maximum 50 requests per window


    message: {
        success: false,
        message: "Too many email requests. Please try again later."
    },


    standardHeaders: true,

    legacyHeaders: false

});