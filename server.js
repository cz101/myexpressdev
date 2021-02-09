if(process.env.NODE_ENV !=='production'){
    require('dotenv').config()
}


const express = require("express")
const app = express()
const expressLayout = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const indexRouter = require('./routes/index')
const authorRouter = require('./routes/authors')
const bookRouter = require('./routes/books')



const mongoose = require('mongoose')
mongoose.connect(process.env.DATEBASE_URL,{
    useNewUrlParser:true,
    useUnifiedTopology: true 
})

const db = mongoose.connection

db.on('error', error => console.error(error))
db.once('open',()=>console.log('Connected to mongoose database'))


app.set('views', __dirname +'/views')
app.set('view engine', 'ejs')
app.set('layout', 'layouts/layout')

app.use(expressLayout)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false}))
app.use(methodOverride('_method'))

app.use('/', indexRouter)

app.use('/authors', authorRouter)
app.use('/books', bookRouter)


app.listen(process.env.PORT || 3000)