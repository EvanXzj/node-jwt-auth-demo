const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const enviroment = process.env.NODE_ENV || 'development'
const stage = require('../config')[enviroment]

// schema maps to a collection
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: 'String',
        required: true,
        trim: true,
        unique: true
    },

    password: {
        type: 'String',
        required: true,
        trim: true
    }
})


// pre hooks
userSchema.pre('save', function(next) {
    const user = this

    // don't rehash if it's an old user
    if (!user.isModified || !user.isNew) {
        next()
    }

    bcrypt.hash(user.password, stage.saltingRounds, function (err, hash) {
        if (err) {
            next(err)
        }

        user.password = hash;

        next()
    })
})

module.exports = mongoose.model('User', userSchema)