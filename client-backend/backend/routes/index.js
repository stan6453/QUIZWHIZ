var express = require('express');
var router = express.Router();

const admin = require("firebase-admin");

admin.initializeApp({
  apiKey: "AIzaSyDrcB0RrBSaQn5-2mbYmGyS5zlzkc9slps",
  authDomain: "quizwhiz-72df8.firebaseapp.com",
  databaseURL: "https://quizwhiz-72df8-default-rtdb.firebaseio.com",
  projectId: "quizwhiz-72df8",
  storageBucket: "quizwhiz-72df8.appspot.com",
  messagingSenderId: "412874254362",
  appId: "1:412874254362:web:9c8128380ab932112b89a3"
});

const db = admin.firestore();

//Test routes
router.get('/', function(req, res) {
  res.end('home');
});

router.get('/test', function(req, res) {

  res.send('doing something');
  
  db.collection('test').add({
    me:'stan'
  });

  res.end();
});

//testpost
router.post('/testpost', function(req, res) {

  res.send('doing something');
  
  console.log(req.body)

  res.end(req.body);
});


/* Teacher routes */
router.post('/create_quiz/:quizId', function(req, res) {
  /* userId is in the quiz object  */

  res.end();
});


router.post('/update_quiz/:id', function(req, res) {
  /* userId is in the quiz object  */
  res.end();
});


router.post('/delete_quiz/:id', function(req, res) {
  /* userId is in the quiz object  */
  res.end();
});


router.get('/quiz/:quizId', function(req, res) {
  /* userId is in the quiz object  */
  res.send('hi from stan')

  res.end();
});


/* Student route */
router.get('/quizinfo/:quizId', function(req, res) {

  res.end();

});


router.get('/taketest/:quizId', function(req, res) {

  res.end();
});


router.post('/submit/:quizId', function(req, res) {

  res.end();
});




// export async function verifyToken(request){
//   try {
//     const token = await getToken(request);

//     if (!token) {
//       return false;
//     }

//     const payload = await auth.verifyIdToken(token);
//     return payload !== null;
//   } catch (err) {
//     return false;
//   }
// }


// async function getToken(request) {
//   if (!request.headers.authorization) {
//     return undefined;
//   }
//   const token = 
//         request.headers.authorization.replace(/^Bearer\s/, '');
//   return token;
// }

module.exports = router;