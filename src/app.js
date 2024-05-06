import express from 'express';
import handlebars from 'express-handlebars';
import {Server} from 'socket.io';
import { __dirname } from './utils.js';

import { uploader } from './utils/multer.js';
import {productRouter} from './routes/api/products.router.js'
import { usersRouter } from './routes/api/users.router.js';
import { cartRouter } from './routes/api/carts.router.js';
import { viewsRouter } from './routes/views.router.js';
import { connectDB } from './config/index.js'
import { messageModel } from './dao/models/messages.model.js';
import { productModel } from './dao/models/products.model.js';
 

const port = process.env.PORT || 8080;
const app = express();

const httpServer = app.listen(port, error => {
    if(error) console.log(error.message)
    console.log(`¡Servidor arriba en el puerto ${port}`)
})

export const io = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname+'/public'));

app.engine('hbs', handlebars.engine({extname:'hbs'}));
app.set('views', __dirname+'/views');
app.set('view engine', 'hbs');

connectDB()

app.use('/subir-archivo', uploader.single('myFile'), (req, res) => {
    if(!req.file) {
        return res.send('No se pudo subir el archivo');
    }
    res.send('Archivo subido');
})

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/users', usersRouter);

app.use('/', viewsRouter);
app.use((error, req, res, next) => {
    console.log(error);
    res.status(500).send('Error 500 en el server')
})

io.on('connection', async (socket) => {
    console.log('Nuevo cliente conectado')

    socket.on('message', async(data) =>{
        let {user, message} = data
        await messageModel.create({user, message})
        const messages = await messageModel.find({})
        io.emit('messageLogs', messages)
    })

    let listadeproductos = await productModel.find({})
    socket.emit("enviodeproducts",listadeproductos)

    socket.on("addProductForm", async(product) => {
        const {title, description, price, status, stock, category, thumbnail} = product
        await productModel.create({
            title,
            description,
            price,
            status,
            stock,
            category,
            thumbnail
        });
        listadeproductos = await productModel.find({})
        socket.emit("enviodeproducts",listadeproductos)
    })

    socket.on("deleteProduct", async(id) => {
        await productModel.deleteOne({_id: id})
        const listadeproductos = await productModel.find({})
        socket.emit("enviodeproducts",listadeproductos)
        })
})