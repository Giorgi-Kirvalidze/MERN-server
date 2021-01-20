const express = require('express')
const path = require('path')
const cors = require('cors')
const env = require('dotenv')
const app = express()
// Routes
const userRoutes = require('./routes/user')
const productRoutes = require('./routes/product')
const categoryRoutes = require('./routes/category')
env.config()
require('./db/mongoose')

app.use(cors())
app.use(express.json())
app.use('/public', express.static(path.join(__dirname, 'uploads')))
app.use(express.urlencoded({ extended: true }))
app.use('/api/users', userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)

const PORT = process.env.PORT || 2000
app.listen(PORT, () => console.log(`Server is running at ${PORT}`))