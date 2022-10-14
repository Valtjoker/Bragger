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
router.get('/posts', Controller.displayHome)
router.get('/add/:userId', Controller.addPostForm)
router.post('/add/:userId', Controller.addPost)
router.get('/:userId', Controller.displayProfile)
router.post('/:userId', Controller.editProfile)
// router.post('/:userId/generateDetail', Controller.addDetailProfile)
router.get('/:userId/:postId/delete', Controller.deletePost)
router.post('/:PostId/comment', Controller.addComment)



module.exports = router