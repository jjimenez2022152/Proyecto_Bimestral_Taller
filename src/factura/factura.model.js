import mongoose from 'mongoose';

const facturaSchema = mongoose.Schema({
    compra: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sales',
        required: true
    },
    total: {
        type: Number,
        required: true
    },
});

export default mongoose.model('Factura', facturaSchema);