const express = require('express')
const session = require('express-session')
const PORT = process.env.PORT || 3000
const app = express()
const router = require('./routes')

app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        sameSite: true
    }
}))

app.use('/', router)

app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}`)
});