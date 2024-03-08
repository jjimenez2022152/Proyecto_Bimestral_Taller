import mongoose from "mongoose";

const CarritoSchema = mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    cantidad: {
        type: Number,
        required: true
    },
    precio: {
        type: Number
    },
    total: {
        type: Number
    }
});

export default mongoose.model('Carrito', CarritoSchema);