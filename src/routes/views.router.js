import {Router} from 'express'
import { productModel } from '../dao/models/products.model.js'
import { __dirname } from '../utils.js'

const router = Router()

router.get('/chat', async (req, res) => {
    try {
        const title = 'Chat'
        res.render('chat', {
            title
        })
    } catch (error) {
        console.error('No se puede cargar la vista.', error)
    }

})

router.get('/home', async (req, res) =>{
    try {
        const title = 'Home';
        const style = './index.css'
        let products = await productModel.find({}).lean()
        res.render('home', {
            title,
            products,
            style
        })
    } catch (error) {
        console.error('No se puede cargar la vista.', error)
    }

})

router.get("/realTimeProducts",(req,res)=>{
    try {
        res.render("realTimeProducts")
    } catch (error) {
        console.error('No se puede cargar la vista.', error)
    }
})

export {router as viewsRouter}
