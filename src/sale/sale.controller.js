import Sale from '../sale/sale.model.js';
import Product from '../product/product.model.js';
import User from '../users/user.model.js';


export const salePost = async (req, res) => {
    try {
        const usuario = req.usuario;

        if (usuario.role !== 'CLIENT_ROLE') {
            return res.status(403).json({ error: 'Acceso denegado. Solo Clientes pueden realizar compras' });
        }

        const { product: productName, cantidad } = req.body;

        const product = await Product.findOne({ name: productName });
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        if (product.stock < cantidad) {
            return res.status(400).json({ error: 'No hay suficiente stock disponible' });
        }

        const nuevaVenta = new Sale({
            product: product._id,
            user: usuario.id, 
            cantidad
        });

        await nuevaVenta.save();

        product.stock -= cantidad;
        await product.save();

        const descripcionProducto = product.description;

        const usuarioCompra = await User.findById(usuario.id);
        const correoUsuarioCompra = usuarioCompra.correo;

        const nombreProducto = product.name;

        const ventaData = {
            message: 'Compra exitosa',
            _id: nuevaVenta._id,
            product: nuevaVenta.product,
            nombreProducto,
            descripcionProducto,
            cantidad: nuevaVenta.cantidad,
            estado: nuevaVenta.estado,
            user: nuevaVenta.user,
            correoUsuario: correoUsuarioCompra,
        };

        res.status(200).json({ venta: ventaData });
    } catch (error) {
        console.error('Error al crear venta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

