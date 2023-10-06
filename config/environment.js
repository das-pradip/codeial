
require('dotenv').config();
const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
//i add rfs.createStream which is not given by sir
const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory
})


const development = {
    name: 'development',
    asset_path: 'assets',
    session_cookie_key: 'blahsomething',
    db: 'codeial_development',
    smtp: {
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
        user: 'shawna.dickens@ethereal.email',
        pass: '5TJJhCfsNmexjqvjSB'
        }
    },
    google_client_id: "277899109442-d1kmht9vn2u3kqv6a3pohnvo81c00mch.apps.googleusercontent.com",
    google_client_secret:"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",
    google_call_back_url: "http://localhost:8000/users/auth/google/callback",
    jwt_secret: /*'codeial'*/ 'k4uUqw6oQp172jCPjfOlPZA9pf2OykEz',
    morgan: {
        mode: 'dev',
        options: {stream: accessLogStream}
    }
}


const production = {
    name: 'production',
    asset_path: process.env.ASSET_PATH,
    session_cookie_key:  process.env.SESSION_COOKIE_KEY,
    db:  process.env.DB,
    smtp: {
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
        user:  process.env.GMAIL_USER ,
        pass: process.env.GMAIL_PASS
        }
    },

    // google_client_id: "277899109442-d1kmht9vn2u3kqv6a3pohnvo81c00mch.apps.googleusercontent.com",
    // google_client_secret:"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",
    // google_call_back_url: "http://codeial.com/users/auth/google/callback",
    // jwt_secret: /*'codeial'*/      'eaS3Zh2XG5D1U9B0jKzvePF5GPRC0ZcA'
    /* process.env.CODEIAL_JWT_SECRET,*/
    google_client_id: process.env.GOOGLE_CLIENT_ID,
    google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
    google_call_back_url: process.env.GOOGLE_CALLBACK_URL,
    jwt_secret: process.env.JWT_SECRET,
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    }
    
}

module.exports = eval(process.env.CODEIAL_ENVIRONMENT) == undefined ? development : eval(process.env.CODEIAL_ENVIRONMENT);