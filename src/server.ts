import "dotenv/config";

import app from "./app.js";


const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {

    console.log({
    port: PORT,
        resend: !!process.env.RESEND_API_KEY,
        apiKey: !!process.env.API_KEY
    });

});