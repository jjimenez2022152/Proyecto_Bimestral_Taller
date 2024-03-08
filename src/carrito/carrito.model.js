import mongoose from "mongoose";

const CarritoSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    productos: [{
        nombreProducto: {
            type: String,
            required: true
        },
        cantidad: {
            type: Number,
            required: true
        },
        precio: {
            type: Number
        },
        subtotal: {
            type: Number
        }
    }]
});

export default mongoose.model('Carrito', CarritoSchema);