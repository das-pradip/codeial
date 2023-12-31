require('dotenv').config();
const express = require('express');
const env = require('./config/environment');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
// const User = require('./models/user');
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
// chage code
const cors = require('cors');

// used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');

// const MongoStore = require('connect-mongo')(session);
const MongoStore = require('connect-mongo'); 
const flash = require('connect-flash');
const customMware = require('./config/middleware');

// setup the chat server to be used with socket.io

const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);

// Allow requests from http://localhost:8000
const corsOptions = {
  origin: 'http://localhost:8000',
};

app.use(cors(corsOptions));

chatServer.listen(5000);
console.log('chat server is listening on port 5000');

// const path = require('path');
// const sassMiddleware = require('sass-middleware');

// app.use(sassMiddleware({
//     src: './assets/scss',
//     dest: './assets/css',
//     debug: true,
//     outputStyle: 'extended',
//     prefix: '/css'
// }));
app.use(express.urlencoded());

app.use(cookieParser());

// app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, env.asset_path)));
// app.use(express.static('./assets'));
//make the uploads path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'))

app.use(logger(env.morgan.mode, env.morgan.options));

app.use(expressLayouts);
//extract style and scripts from sub pages into layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);




//set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');





// mongo store is used to store the session cookie in the db
app.use(session({
    name: 'codeial',
    // TODO change the secret before deployment in production mode
    // secret: 'blahsomething',
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    store: new MongoStore({
        mongoUrl: 'mongodb://0.0.0.0:27017/codeial_development',
        // mongooseConnection: db,
        // autoRemove: 'disabled'
    },
    function(err){
        console.log(err || 'connect-mongodb setup ok');
    },
    ),
    cookie: {
        maxAge: (100 * 60 * 100)
    }

}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);


// use express router
app.use('/', require('./routes'));

app.listen(port, function(err){
    if(err){
        console.log(`Error in running the server: ${err}`);
     
    }

    console.log(`Server is running on port: ${port}`);

});