const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session');
const app = express()
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
let mongo = mongoose.connect('mongodb://127.0.0.1:27017/mnst')
mongo.then(data => console.log('success'))
mongo.catch(err => console.log(err))
app.use(session({
    secret: 'Mysterious',
    resave: false,
    saveUninitialized: false
}));
  
const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});
const Model = mongoose.model('projects', schema)
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/home.html')
})
app.get('/signup', (req, res) => {
    
    res.sendFile(__dirname + '/signup.html')
})
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html')
})
app.post('/submit', (req, res) => {
    const data = new Model({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    })
    data.save().then(() => console.log('stored to db successfully')).catch(err => console.log('error', err))
    // console.log('submitted')
    res.redirect('/login')
})
app.post('/loginvalidation', (req, res) => {
    const { username, password } = req.body;
Model.findOne({ username:username, password:password }).then(data=>{
    if (data==null) {
      res.send('<html><body><center><h2>Invalid username or password</h2></center></body></html>')
    } 
    else {
      // Redirect to the skills.html page upon successful login
      console.log(data);
      res.redirect('/skills.html');
    }
})
})
app.get('/skills.html', (req, res) => {
    res.sendFile(__dirname + '/skills.html');
});
app.post('/Next', (req, res) => {
     res.sendFile(__dirname + '/academic.html');
});
app.get('/Next', (req, res) => {
    
    res.sendFile(__dirname + '/academic.html')
})
function requireAuth(req, res, next) {
    if (req.session && req.session.isAuthenticate){
      // User is authenticated, proceed to the next middleware or route handler
      next();
    } else {
      // Redirect to the login page or display an error message
      res.status(403).send('<html><body bgcolor="cyan"><center><h2>Only Authenticated users can see the data</h2></center></body></html>');
    }
  }
  
  // Serve the academic.html page with authentication check
  app.get('/academic.html', requireAuth, (req, res) => {
    res.sendFile(__dirname + '/academic.html');
  });
app.listen(2000, () => {
    console.log('Server started on port 2000');
});