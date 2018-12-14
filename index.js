// Sets up dotenv as soon as our application starts
require('dotenv').config()

const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()
const router = express.Router()

const routes = require('./routes')

const enviroment = process.env.NODE_ENV || 'development'
const stage = require('./config')[enviroment]
const connUri = process.env.MONGO_LOCAL_CONN_URL

mongoose.connect(connUri, {
    useNewUrlParser: true,
    useCreateIndex: true
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log('Database connected')
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

if (enviroment !== 'production') {
    app.use(logger('dev'))
}

app.use('/api/v1', routes(router))

app.listen(`${stage.port}`, () => {
    console.log(`Server now listening at localhost:${stage.port}`);
})