const express = require('express')
const cors = require('cors')
const env = require('dotenv')
const app = express()
// Routes
const authRoutes = require('./routes/user')
env.config()
require('./db/mongoose')


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api', authRoutes)

const PORT = process.env.PORT || 2000
app.listen(PORT, () => console.log(`Server is running at ${PORT}`))