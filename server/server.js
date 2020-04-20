const express = require('express');
const mongoose = require('mongoose');
const env = require('dotenv').config()
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();

const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const resourcesRouter = require('./routes/resources');

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.urlencoded())
app.use(pino);

// Set up DB connection
const MONGODB_URL = process.env.MONGODB_URL;
mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Routes
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/resources', resourcesRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`)
})
