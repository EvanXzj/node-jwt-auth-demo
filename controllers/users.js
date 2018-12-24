const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/users')

module.exports = {
    add: (req, res) => {
       const result = {} 
       let status = 201

       const {name, password} = req.body

       const user = new User({name, password})

       user.save((err, u) => {
            if (err) {
                status = 500
                result.status = status
                result.error = err
            } else {
                result.status = status
                result.result = user
            }

            res.status(status).send(result)
       })
    },

    login: (req, res) => {
        const {name, password} = req.body
        const result = {}
        let status = 200

        User.findOne({name}, (err, user) => {
            if (!err && user) {
                bcrypt.compare(password, user.password).then(match => {
                    if (match) {
                        result.status = status
                        result.result = user

                        // create a token 
                        const payload = {user: user.name}
                        const options = {expiresIn: '2d', issuer: 'http://www.chuidylan.com'}
                        const secret  = process.env.JWT_SECRET
                        const token = jwt.sign(payload, secret, options)
                        result.token = token
                    } else {
                        status = 401
                        result.status = status
                        result.error = 'Authentication error'
                    }
                    
                    res.status(status).send(result)
                }).catch(err => {
                    status = 500
                    result.status = status
                    result.error = err

                    res.status(status).send(result)
                })
            } else {
                status = 404
                result.status = status
                result.error = err

                res.status(status).send(result)
            }
        })
    },

    getAll: (req, res, next) => {
        const payload = req.decoded

        if (payload && payload.user === 'admin') {
            User.find({}, (err, users) => {
                if (err) {  
                    next(err)
                }

                res.send(users)
            })
        } else {
            status = 401;
            result.status = status;
            result.error = `Authentication error`;
            res.status(status).send(result);
        }
    }
}