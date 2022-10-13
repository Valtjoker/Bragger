const { User, Post, Tag, Post_Tag } = require('../models/index')
const bcrypt = require('bcryptjs');
let ip2location = require('ip-to-location');
class Controller {
    // ! Done
    static displayLoginForm(req, res) {
        // console.log(req.query);
        let error = req.query.error
        res.render('login', { error })
    }

    // ! Done
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

    // ! Done
    static displayRegisterForm(req, res) {
        res.render('register')
    }

    // ! Done
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

    // ! Done (SHOW ALL POST FROM ALL USER) (UNCOMMENT WHERE JIKA MAU TAMPIL POST SPESIFIK USER ATAU USER YANG LOGIN)
    static displayHome(req, res) {
        // console.log(req.session.userId);
        const { userId, userName, userIp} = req.session
        
        Post.findAll({
            include: [{
                model: Tag,
                attributes: ['id', 'name']
            },
            {
                model: Post_Tag,
                // where: {
                //     UserId : userId
                // },
                attributes: ['comment', 'reaction', 'id']
            }
        ]
        })
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

    // ! Undone
    static addPostForm(req, res) {
        const {userId} = req.params
        User.findOne({where:{id:userId}})
        .then((data)=>{res.render('add', {data})})
    }

    // ! Undone
    static addPost(req, res) {
        res.render('home')
    }
    
    // ! Done
    static displayProfile(req, result) {
        const { userId, userName, userIp} = req.session
        // console.log(req.params);
        // const { userId } = req.params
        User.findByPk(userId)
        .then((data) => {
            ip2location.fetch(userIp).then(location => {
                // return res
                // console.log(location.country_name);
                result.render('profile', {data, userIp, location, userId})
            });
        })
        .catch((err) => {
            console.log(err);
        })
    }

    // ! Undone
    static editProfile(req, res) {

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

    // ! Done
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