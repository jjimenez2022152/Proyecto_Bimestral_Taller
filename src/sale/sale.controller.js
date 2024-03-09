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

        const totalCompra = product.price * cantidad;

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
            total: totalCompra,
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

export const getSale = async (req, res) => {
    try {
        // Obtener el usuario desde el token
        const usuario = req.usuario;

        // Verificar el rol del usuario
        if (usuario.role !== 'CLIENT_ROLE') {
            return res.status(403).json({ error: 'Acceso denegado. Solo clientes pueden acceder a sus ventas' });
        }

        // Buscar ventas del usuario
        const sales = await Sale.find({ user: usuario.id }).populate('product').exec();

        // Si no hay ventas, retornar un mensaje
        if (sales.length === 0) {
            return res.status(404).json({ error: 'No se encontraron ventas para este usuario' });
        }

        // Obtener el correo del usuario
        const user = await User.findById(usuario.id);

        // Calcular el total de cada venta y filtrar la información
        const ventasData = sales.map(venta => ({
            _id: venta._id,
            producto: venta.product.name,
            cantidad: venta.cantidad,
            total: venta.cantidad * venta.product.price, // Total de la compra
            estado: venta.estado,
            correoUsuario: user.correo,
        }));

        res.status(200).json({ ventas: ventasData });
    } catch (error) {
        console.error('Error al obtener ventas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};