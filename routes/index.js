const express = require('express')
const Controller = require('../controllers/controller')
const router = express.Router()

router.get('/', (req, res) => {
    res.redirect('/login')
})

router.get('/login', Controller.displayLoginForm)
router.post('/login', Controller.loginHandler)

router.get('/register', Controller.displayRegisterForm)
router.post('/register', Controller.registerHandler)

const isLoggedIn = function (req, res, next) {
    // console.log(req.session);

    if (!req.session.userId) {
        const error = "Please Login First!"
        res.redirect(`/login?error=${error}`)
    } else {
        next()
    }
}

router.use(isLoggedIn)
router.get('/home', Controller.displayHome)
router.get('/logout', Controller.logoutHandler)

module.exports = router