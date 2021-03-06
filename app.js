const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

// Load User model

require('./models/user')
//passport config - the module in the file required is a function, which accepts an argument passport
require('./config/passport')(passport);

//Load routes
const auth = require('./routes/auth');

// Load mongoose keys
const keys = require('./config/keys');

// Map global promises
mongoose.Promise = global.Promise
// mongoose connect
mongoose.connect(keys.mongoURI, {
   useNewUrlParser: true
}) // note connect returns promise
 .then(() => console.log('MongoDb connection'))
 .catch(err => console.log(err));

const app = express();

app.get('/',(req, res) => {
  res.send('HOME');
});


app.use(cookieParser());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global vars just like current_user if user logged in
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});
// use auth Routes : anything that routes to /auth goes to auth.js
app.use('/auth', auth);



var port = process.env.PORT || 3000;
// start the server and loisten on the port
app.listen(port, () => {
  // res.send('HELLO');
  console.log(`started server on port ${port}`);
})
