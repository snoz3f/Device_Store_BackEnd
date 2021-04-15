const uuid = require('uuid')
const path = require('path')
const ApiError = require("../error/apiError");
const {Device, DeviceInfo} = require('../models/models')

class DeviceController{

    async Create(req, res, next){
        try {
            let {name, price, brandId, typeId, info } = req.body
            const {img} = req.files
            let fileName = uuid.v4() + ".jpg"
            await img.mv(path.resolve(__dirname, '..', 'static', fileName))



            const device = await Device.create({name, price, brandId, typeId, img: fileName})

            if (info){
                info = JSON.parse(info)
                info.forEach( i => {
                     DeviceInfo.create(
                        {
                            title: i.title,
                            description: i.description,
                            deviceId: device.id
                        }
                    )
                })
            }

            res.json(device)
        }catch (e){
            next(ApiError.badRequest())
        }
    }
    async getOne(req, res){
        const {id} = req.params
        const device = await Device.findOne({
            where: {id},
            include: [{model: DeviceInfo, as: 'info'}]
        })
        return res.json(device)
    }
    async getAll(req, res){
        let {brandId, typeId, limit, page} = req.query
        let devices;
        page = page || 1
        limit = limit || 9
        let offset = page * limit - limit
        if(!brandId && !typeId){
            devices = await Device.findAndCountAll({limit, offset})
        }
        if(brandId && !typeId){
            devices = await Device.findAndCountAll({where: {brandId, limit, offset}})
        }
        if(!brandId && typeId){
            devices = await Device.findAndCountAll({where: {typeId, limit, offset}})
        }
        if(brandId && typeId){
            devices = await Device.findAndCountAll({where: {typeId, brandId, limit, offset}})
        }


        return res.json(devices)
    }
}

module.exports = new DeviceController()