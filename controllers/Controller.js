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

    // ! Done
    static displayHome(req, res) {
        // console.log(req.session.userId);
        const { userId, userName, userIp} = req.session
        
        Post.findAll({
            // include: {
            //     model: Post_Tag,
            //     // where : {
            //     //     UserId : userId
            //     // },
            //     model: Tag
            // }
            include: [{
                model: Tag,
                attributes: ['id', 'name']
            },
            {
                model: Post_Tag,
                where: {
                    UserId : userId
                },
                attributes: ['comment', 'reaction', 'id']
            }
        ]
        })
        // Post_Tag.findAll({
        //     include: Post
        // })
        .then((data) => {
            // console.log(userName);
            res.render('home', {data, userName, userIp, userId})
            // res.send(data)
        })
        .catch((err) => {
            console.log(err);
            res.send(err)
        })
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

    // ! Done
    static deletePost(req, res) {
        const { userId, postId } = req.params
        Post.destroy({
            where : {
                id : postId
            }
        })

        .then((data) => {
            return Post_Tag.destroy({
                where : {
                    UserId : userId,
                    PostId : postId
                }
            })
        })

        .then((result) => {
            res.redirect('/home')
        })

        .catch((err) => {
            console.log(err);
            res.send(err)
        })
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