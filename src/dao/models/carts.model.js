import { Schema, SchemaType, model } from "mongoose";

//Definimos el nombre de la coleccion
const cartCollection = 'carts'

//Definimos como va a ser la estructura de la coleccion
const cartSchema = new Schema({
    product: [Schema.Types.Mixed],
})

export const cartModel = model(cartCollection, cartSchema)