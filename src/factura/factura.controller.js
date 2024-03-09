import Factura from '../factura/factura.model.js';
import Sale from '../sale/sale.model.js';
import Product from '../product/product.model.js';

export const facturaPost = async (req, res) => {
    try {
        const { salesId } = req.body;

        // Verificar si la venta existe
        const venta = await Sale.findById(salesId);
        if (!venta) {
            return res.status(404).json({ error: 'La venta especificada no existe' });
        }

        // Calcular el total de la venta
        const total = await calcularTotal(salesId);
        
        // Crear la factura
        const nuevaFactura = new Factura({
            compra: venta._id,
            total
        });

        // Guardar la factura en la base de datos
        await nuevaFactura.save();

        res.status(201).json({ factura: nuevaFactura });
    } catch (error) {
        console.error('Error al crear factura:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};