const controller = require('../controllers/users')
const utils = require('../utils')

module.exports = (router) => {
    router.route('/users').post(controller.add).get(utils.validateToken, controller.getAll)

    router.route('/login').post(controller.login)
}