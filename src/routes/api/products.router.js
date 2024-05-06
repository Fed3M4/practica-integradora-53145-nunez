import { Router } from 'express';
import { io } from '../../app.js';
import { productModel } from '../../dao/models/products.model.js';
import { getRandomCode } from '../../utils/functions.js';

const router = Router()

router.get('/', async (req, res) =>{
    try {
        const products = await productModel.find({})
        const limit = req.query.limit;
        if(!limit) return res.send(products);
        res.send(products.slice(0, limit));
    } catch (error) {
        console.error('No se pudieron cargar los pruductos por el error: ', error.message)
    }
})

router.get('/:pid', async(req, res) => {
    try {
        const id = req.params.pid;
        const productById = await productModel.find({_id: id})
        if (!productById){
            return console.log('No hay ningún producto con ese ID')
        }
        res.send(productById);
    } catch (error) {
        console.error('Se produjo un error al buscar el id: ', error.message)
    }
})

router.post('/', async (req, res) => {
    const code = getRandomCode(9)
    const { title, description, price, status, stock, category, thumbnail} = req.body;
    if (!title || !description || !price || !status || !stock || !category) {
        return res.send({ status: "error", message: "Faltan completar valores" });
    }
    try {
        await productModel.create({title, description, price, status, stock, category, thumbnail, code});
        const products = await productModel.find({})
        io.emit('updateProducts', products)
        return res.send({ status: "success", message: "Producto agregado" });
    } catch (error) {
        console.error(error);
    }
});

router.put('/:pid', async (req, res) => {
    const id = req.params.pid;
    const {title, description, price, status, stock, category, thumbnail} =  req.body;
    try {
        await productModel.updateOne({_id: id}, {title, description, price, status, stock, category, thumbnail})
        res.send(await productModel.find({_id: id}));
    } catch (error) {
        console.error('El error es: ', error)
        res.send({status: "error", message: "Hubo un error"});
    }
})

router.delete('/:pid', async (req, res) => {
    const pid = req.params.pid;
    try {
        await productModel.deleteOne({_id: pid})
        res.send({status: "success", message: "Producto eliminado correctamente"})
    } catch (error) {
        res.send({status: "error", message: error.message})
    }
})

export {router as productRouter}