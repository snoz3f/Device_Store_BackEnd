require('dotenv').config();
const express = require('express');
const sequelize = require('./db.js');
const models = require('./models/models')
const cors = require('cors')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const fileUpload = require('express-fileupload')
const path = require('path')


const app = express();

app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/api', router)
app.use(errorHandler)

const PORT = process.env.PORT || 5000



const start = async () => {
    try{
        app.listen(PORT, () => {
            console.log('Сервер запущен')
        })

        await sequelize.authenticate()
        await sequelize.sync()

    }catch (e) {
        console.log(e)
    }
}

start()