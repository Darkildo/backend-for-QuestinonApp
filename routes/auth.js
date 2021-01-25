const expess = require('express')
const router = expess.Router()
const controller = require('../controllers/auth')



 router.post('/login', controller.login)

 router.post('/register', controller.register)


module.exports = router



