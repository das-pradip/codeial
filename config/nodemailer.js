const nodemailer = require("nodemailer");
const ejs = require('ejs');
const path = require('path');
const env = require('./environment');

let transporter = nodemailer.createTransport(
    env.smtp
    // {
//    service: 'gmail',
//    host: 'smtp.gmail.com',
//    port: 587,
//    secure: false,
//    auth: {
//        user: 'pd2691999@gmail.com',
//        pass: '12345'
//    }


// host: 'smtp.ethereal.email',
// port: 587,
// auth: {
//     user: 'shawna.dickens@ethereal.email',
//     pass: '5TJJhCfsNmexjqvjSB'
// }

// }
);


let renderTemplate = (data, relativePath) => {
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        function(err, template){
            if(err){console.log('error in rendering template', err);
            return;
            }

            mailHTML = template;
        }
    )

    return mailHTML;
}

module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}
