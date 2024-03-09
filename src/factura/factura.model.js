import mongoose from 'mongoose';

const facturaSchema = mongoose.Schema({
    sale: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sales',
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    fechaCompra: {
        type: Date,
        default: Date.now
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }
});

export default mongoose.model('Factura', facturaSchema);

