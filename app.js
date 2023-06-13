const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')

require('dotenv').config()

app.use(bodyParser.urlencoded({
    extended:true 
}))
app.use(bodyParser.json());
app.use(cors());

// imprt routes
const authRoutes = require('./routes/auth')
const postRoutes = require('./routes/post')
app.use('/auth', authRoutes)
app.use('/post', postRoutes)


app.get('/', (req, res) => {
    res.send('Hello Welcome to Vercel-apps')
})
mongoose.connect(process.env.DB_CONNECTION,{
    useNewUrlParser: true,
    useUnifiedTopology:true
})
let db = mongoose.connection

//handle error
db.on('error', console.error.bind(console,'Error Establishing a Database Connection?'))
//handle succ
db.once('open', ()=>{
    console.log('Database is Connected')
})



app.listen(process.env.PORT, () => {
    console.log(`Server Running on port ${process.env.PORT}`)
})