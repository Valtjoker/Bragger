const { User, Post, Tag, Post_Tag, UserDetail } = require('../models/index')
const bcrypt = require('bcryptjs');
const { Op } = require("sequelize");
const publishSince = require('../helpers/publishSince')
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
            .then((data)=>{
                UserDetail.create({UserId:data.id})
            })
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
        const { search } = req.query
        const { userId, userName, userIp} = req.session
        let option = {
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
        }
        
        if (search) {
            option = {
                where : {
                    title : {
                        [Op.iLike] : `%${search}%`
                    }
                },
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
            }
        }
        Post.findAll(option)
        .then((data) => {
            // console.log(userName);
            res.render('home', {data, userName, userIp, userId, publishSince})
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
        .catch(err=>{res.send(err)})
    }

    // ! Undone
    static addPost(req, res) {
        const {userId} = req.params
        const{title,contentURL,description, tagNames} = req.body
        let hashtags = tagNames.split(' ')
        let tags = []

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
            if(tags.length > 0){
                tags.forEach(e=>{
                    Post_Tag.create({PostId:data.id, TagId:e.id, UserId:userId})
                })
            }
        })
        .then(()=>{
            res.redirect("/")
        })
    }
    
    // ! Done
    static displayProfile(req, result) {
        const { userId, userName, userIp} = req.session
        // console.log(req.params);
        // const { userId } = req.params
        User.findOne({
            where:{
                id:userId
            },
            include:{
                model:UserDetail
            }
        })
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
        const {userId} = req.session
        const {gender, catchphrase, description} = req.body
        UserDetail.update({gender:gender, catchphrase:catchphrase, description:description}, {where:{UserId:userId}})
        .then((data)=>{res.redirect(`/${userId}`)})
        .catch(err=>{res.send(err)})
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