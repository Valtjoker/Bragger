const { User, Post, Tag, Post_Tag } = require('../models/index')
const bcrypt = require('bcryptjs');
const tag = require('../models/tag');
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
        let {userId, userName, userIp} = req.session
        res.render('home',{userId, userName, userIp})
    }

    static addPostForm(req, res) {
        const {userId} = req.params
        User.findOne({where:{id:userId}})
        .then((data)=>{res.render('add', {data})})
        .catch(err=>{res.send(err)})
    }

    static addPost(req, res) {
        const {userId} = req.params
        const{title,contentURL,description, tagNames} = req.body
        let tags = []
        let hashtags = tagNames.split(' ')

        hashtags.forEach(e=>{
            Tag.findOrCreate({
               where:{
                name: e
               }
            })
            .then((data)=>{
                tags.push(data[0])
            })
        })
        Post.create({title, contentURL, description})
        .then((data)=>{
            
        })
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