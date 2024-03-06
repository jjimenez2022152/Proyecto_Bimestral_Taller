import mongoose from 'mongoose';

const saleSchema = mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    }
});

saleSchema.methods.toJSON = function() {
    const { __v, ...saleData } = this.toObject();
    return saleData;
};

export default mongoose.model('sale', saleSchema);     

