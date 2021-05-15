//** Express server imports **//
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 3000;

//** Additional imports **//
const path = require('path');

//routers
const dbRouter = require("./routes/dbRouter.ts");
const kafkaRouter = require("./routes/kafkaRouter.ts");
const userRouter = require("./routes/userRouter.ts");

//** Serve all compiled files when running the production build **//
app.use(express.static(path.resolve(__dirname, '../src')));
app.use('/build', express.static(path.join(__dirname, '../build')));

//** Automatically parse urlencoded body content from incoming requests and place it in req.body **//
app.use(express.json());
app.use(express.urlencoded({extended: true}));


//** Middleware to serve the main html file **//
const serveMainFile = (req, res) => {
    return res.status(200).sendFile(path.join(__dirname, '../src/index.html'));
}

//** Routes requiring main file **//
app.get('/', serveMainFile);
app.get('/login', serveMainFile)
app.get('/signup', serveMainFile)
app.get('/about', serveMainFile)


//** No route / 404 Handler **//
app.use('*', (req, res) => res.status(404).send('Error 404: This page doesn\'t exist!'));

//** Global Error Handler **//
app.use((err, req, res, next) => {
    const defaultErr = {
      log: 'Express error handler caught unknown middleware error',
      status: 500,
      message: { err: 'An error occurred' },
    };
    const errorObj = Object.assign({}, defaultErr, err);
    console.log(errorObj.log);
    return res.status(errorObj.status).json(errorObj.message);
  });

app.listen(PORT, () =>{console.log(`Server is up and listening on port ${PORT}.`)});

module.exports = app;