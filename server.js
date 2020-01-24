require('dotenv').config()
const {loginRequired, ensureCorrectUser} = require('./middleware/auth');
const errorHandler = require('./handlers/error.js');
const messagesRoutes = require('./routes/messages');
const authRoutes = require('./routes/auth');
const bodyParser = require('body-parser');
const express = require('express');
const db = require('./models');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use(
  '/api/users/:id/messages', 
  loginRequired, 
  ensureCorrectUser, 
  messagesRoutes
);

app.get('/api/messages', loginRequired, async function(req, res, next){
  try {
    let messages = await db.Message.find()
      .sort({ createdAt: 'desc' })
      .populate('user', {
        username: true,
        profileImageUrl: true
      });
      return res.status(200).json(messages);
  } catch (err) {
    return next(err);
  }
})

// ROUTES HERE

// app.get('/api/customers', (req, res) => {
//   const customers = [
//     {id: 1, firstName: 'John', lastName: 'Doe'},
//     {id: 2, firstName: 'Brad', lastName: 'Traversy'},
//     {id: 3, firstName: 'Mary', lastName: 'Swanson'},
//   ];

//   res.json(customers);
// });

// If routes are not reached: (404 error)
app.use(function(req, res, next){
  let err = new Error("404 Not found")
  err.status = 404;
  next(err)
})

app.use(errorHandler)

app.listen(port, ()=>{
  console.log(`Server started on port ${port} at ${Date(Date.now())}`);
});

/////////////////////////


// const expressSanitizer = require('express-sanitizer');
// const methodOverride = require('method-override');

// const express = require('express');
// const app = express();
// const port = 3000;

// // APP CONFIG
// app.set('view engine', 'ejs');
// app.use('/public', express.static('public'));
// app.use(methodOverride('_method'))

// app.use(bodyParser.urlencoded({extended: true}));

// app.use(expressSanitizer());

// //MONGOOSE/MODEL CONFIG
// const mongoose = require('mongoose');
// //or use your cloud uri instead, remembering to fill in the password
// let dbName = 'dbNameHere'
// let uri = 'mongodb://localhost:27017/' + dbName
// let options = {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
  // useCreateIndex: true,
  // serverSelectionTimeoutMS: 5000
// }
// mongoose.connect(uri, options).then(
  // ()=>{
    // console.log(`Successfully connected to mongodb database ${dbName} at ${new Date}.`)
  // },
  // err=>{
    // console.log(err);
  // }
// )

// EXAMPLE MONGOOSE SCHEMA/MODEL
// let blogSchema = new mongoose.Schema({
// 	title: String,
// 	image: String,
// 	body: String,
// 	created: {
// 		type: Date, 
// 		default: Date.now
// 	}
// })

// let Blog = mongoose.model('Blog', blogSchema);

// Blog.create({
// 	title: 'Test Blog',
// 	image: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
// 	body: 'HELLO I AM DOG THIS IS MY BLOG POST'
// })
// ROUTES
// Name    Path             HTTP Verb   Purpose
// ===============================================
// Index    /dogs           GET         List all dogs
// New      /dogs/new       GET         Show new dog form
// Create   /dogs           POST        Create a new dog, then redirect somewhere
// Show     /dogs/:id       GET         Show info about one specific dog
// Edit     /dogs/:id/edit  GET         Show edit form for one dog
// Update   /dogs/:id       PUT         Update a particular dog, then redirect somewhere
// Destroy  /dogs/:id       DELETE      Delete a particular dog, then redirect somewhere
// ===============================================

// app.get('/', (req, res)=>{
//   res.render('home');
//   // may be conventional to redirect to the index page
//   res.redirect('/blogs');
// });

// app.get('/blogs', (req, res)=>{
//   res.render('index');
// });




