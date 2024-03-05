import mongoose from 'mongoose';

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    unique: true,
  },
  description: {
    type: String,
    required: [true, "La descripcion es obligaroria"],
  },
});

categorySchema.methods.toJSON = function() {
    const { __v, ...category } = this.toObject(); 
    return category; 
};
export default mongoose.model('Categorie', categorySchema);