const { User, Post, Tag, Post_Tag } = require('../models/index')
const bcrypt = require('bcryptjs');
class Controller {
    static displayLoginForm(req, res) {
        // console.log(req.query);
        let error = req.query.error
        res.render('login', { error })
    }

    static loginHandler(req, res) {
        const { userName, password } = req.body

        User.findOne({ where: { userName } })
            .then((user) => {
                // console.log(data, "<<<");

                if (user) {
                    const isValidPassword = bcrypt.compareSync(password, user.password)

                    if (isValidPassword) {
                        req.session.userId = user.id
                        req.session.userName = user.userName
                        req.session.userIp = user.ip
                        return res.redirect('/home')
                    } else {
                        const error = "Invalid username/Password"
                        return res.redirect(`/login?error=${error}`)
                    }
                } else {
                    const error = "Invalid username/Password"
                    return res.redirect(`/login?error=${error}`)
                }
            })

            .catch((err) => {
                console.log(err);
                res.send(err)
            })
    }

    static displayRegisterForm(req, res) {
        res.render('register')
    }

    static registerHandler(req, res) {
        const { userName, email, password } = req.body

        User.create({ userName, password, email })
            .then((data) => {
                res.redirect('/login')
            })
            .catch((err) => {
                console.log(err);
                res.send(err)
            })
    }

    static displayHome(req, res) {
        res.render('home')
    }

    static addPostForm(req, res) {
        const {userId} = req.params
        User.findOne({where:{id:userId}})
        .then((data)=>{res.render('add', {data})})
    }

    static addPost(req, res) {
        res.render('home')
    }
    
    static displayProfile(req, res) {
        res.render('home')
    }

    static editProfile(req, res) {
        res.render('home')
    }

    static deletePost(req, res) {
        res.render('home')
    }


    static logoutHandler(req, res) {
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
            } else {
                res.redirect('/login')
            }
        })
    }
}

module.exports = Controller