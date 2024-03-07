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

        // Verificar si el producto existe por su nombre
        const product = await Product.findOne({ name: productName });
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Verificar si hay suficiente stock
        if (product.stock < cantidad) {
            return res.status(400).json({ error: 'No hay suficiente stock disponible' });
        }

        // Crear nueva venta
        const nuevaVenta = new Sale({
            product: product._id,
            user: usuario.id, // Asignar automáticamente el ID de usuario desde el token JWT
            cantidad
        });

        // Guardar la venta en la base de datos
        await nuevaVenta.save();

        // Actualizar el stock del producto
        product.stock -= cantidad;
        await product.save();

        // Obtener la descripción del producto
        const descripcionProducto = product.description;

        // Obtener el correo del usuario que realiza la compra
        const usuarioCompra = await User.findById(usuario.id);
        const correoUsuarioCompra = usuarioCompra.correo;

        // Obtener el nombre del producto
        const nombreProducto = product.name;

        // Incluir todos los datos en la respuesta
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

