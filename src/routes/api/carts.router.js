import { Router } from 'express';
import { cartModel } from '../../dao/models/carts.model.js';

const router = Router()

router.get('/', async (req, res) => {
    try {
        const cart = await cartModel.find({})
        if(!cart) console.log('No hay ningún carrito')
        res.send(cart)
    } catch (error) {
        console.error('Hubo un error al traer los carritos: ', error)
    }
})

router.get('/:cid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const selectedCart = await cartModel.find({_id: cid})
        if(!selectedCart) res.send({status: "error", message: "No hay un carrito con ese ID"})
        const productsCarrito = JSON.stringify(carritoSelected.products)
        res.send({status: "success", message: `Su producto es ${productsCarrito}`})
        return selectedCart
    } catch (error) {
        console.error('Hubo un error al traer los carritos.', error.message)
    }
})

router.post('/', async (req, res) => {
    try {
        await cartModel.create({product : []})
        return res.send({ status: "success", message: "Carrito creado correctamente" });
    } catch (error) {
        console.error(error);
        return res.send({ status: "error", message: "Error al crear carrito" });
    }
});

router.put('/:cid/product/:pid', async(req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const {quantity} = req.body;
    try {
        const cartUpdate = await cartModel.find({_id: cid});
        if(cartUpdate){
            console.log(cartUpdate[0].product)
            console.log(cartUpdate)

            let productIndex = cartUpdate[0].product.findIndex(product => product.productID === pid)
            if(productIndex !== -1) {
                const oldQ = cartUpdate[0].product[productIndex].quantity
                const newQ = oldQ + quantity
                await cartModel.updateOne({_id: cid}, {product: [{productID: pid, quantity: newQ}]})

            } else {
                await cartModel.updateOne({_id: cid}, {product: [{productID: pid, quantity: quantity}]})
            }
            res.send({status: "success", message: "Producto actualizado"})
            return await cartModel.find({_id: cid})
        }
        return console.log('No existe el carrito a actualizar')
    } catch (error) {
        res.send({status: "error", message: error.message})
    }
})

router.delete('/:cid', async (req, res) => {
    try {
        const cid = req.params.cid
        await cartModel.deleteOne({_id: cid})
        res.send({status: "success", payload: "Carrito borrado con éxito"})
    } catch (error) {
        console.error('Hubo un error al eliminar el carrito: ', error)
    }
})

export {router as cartRouter}