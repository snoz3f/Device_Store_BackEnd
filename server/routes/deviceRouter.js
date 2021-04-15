const Router = require('express')
const router = new Router()
const DeviceController = require('../controllers/deviceController')

router.post('/', DeviceController.Create)
router.get('/', DeviceController.getAll)
router.get('/:id', DeviceController.getOne)


module.exports = router