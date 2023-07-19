const nodemailer = require("nodemailer");


  
module.exports = async(email, subject, text) => {
    try {
        const transporter =  nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            port: process.env.EMAIL_PORT,
            secure: process.env.SECURE,
            auth:{
                user: process.env.USER,
                pass: process.env.PASS
            }
        });

        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            text: text
        })
       

    } catch (error) {



      return error;
    }

};