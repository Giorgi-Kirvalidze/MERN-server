const mongoose = require('mongoose')
mongoose.connect(process.env.DB_CONNECTION_URL, { useUnifiedTopology: true, useFindAndModify: false, useNewUrlParser: true, useCreateIndex: true })
const db = mongoose.connection

db.on('error', (error) => console.log({ message: error }))
db.once('open', () => console.log('Database connected'))
