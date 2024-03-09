import Factura from '../factura/factura.model.js';
import Sale from '../sale/sale.model.js';
import Product from '../product/product.model.js';

export const generarFactura = async (req, res) => {
    try {
        const usuario = req.usuario;

        if (usuario.role !== 'ADMIN_ROLE') {
            return res.status(403).json({ error: 'Acceso denegado. Solo los clientes pueden generar facturas' });
        }

        const { idCompra } = req.body;
        const sale = await Sale.findById(idCompra);
        
        if (!sale) {
            return res.status(404).json({ error: 'La venta especificada no existe' });
        }

        const { product, user, cantidad } = sale;

        const producto = await Product.findById(product);

        if (!producto) {
            return res.status(404).json({ error: 'El producto de la venta no existe' });
        }

        const total = producto.price * cantidad;

        const usuarioVenta = await User.findById(sale.user);

        if (!usuarioVenta) {
            return res.status(404).json({ error: 'El usuario de la venta no existe' });
        }

        const factura = new Factura({
            sale: idCompra,
            total,
            fechaCompra: sale.createdAt,
            usuario: {
                _id: usuarioVenta._id,
                nombre: usuarioVenta.nombre,
                correo: usuarioVenta.correo
            }
        });

        await factura.save();

        res.status(201).json({ factura });
    } catch (error) {
        console.error('Error al generar factura:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};