'use strict'

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { dbConnection } from './mongo.js';
import userRoutes from '../src/users/user.routes.js';
import authRoutes from '../src/auth/auth.routes.js'
import categoryRoutes from '../src/category/category.routes.js';
import productRoutes from '../src/product/product.routes.js';
import saleRoutes from '../src/sale/sale.routes.js';
import carritoRoutes from '../src/carrito/carrito.routes.js';
import facturaRoutes from '../src/factura/factura.routes.js';

import User from "../src/users/user.model.js";
import Category from '../src/category/category.model.js';
import bcryptjs from 'bcryptjs';

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuarioPath = '/proyectoBim/v1/users';
        this.authPath = '/proyectoBim/v1/auth';
        this.categoryPath = '/proyectoBim/v1/category';
        this.productPath = '/proyectoBim/v1/product';
        this.salePath = '/proyectoBim/v1/sale';
        this.carritoPath = '/proyectoBim/v1/carrito';
        this.facturaPath = '/proyectoBim/v1/factura';

        this.middlewares();
        this.conectarDB();
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
        const lengthUsers = await User.countDocuments()
        if (lengthUsers > 0 ) return;

        const salt = bcryptjs.genSaltSync();
        const password = bcryptjs.hashSync('123456', salt);

        const adminUser = new User(
            { nombre: "Alejandro", correo: "admin@gmail.com", password, role: "ADMIN_ROLE" }
        )

        adminUser.save()
        

        /*const lenghtCategory = await Category.countDocuments()
        if (lenghtCategory > 0 ) return;

        const categoryDefault = new Category(
            { name: "Producto Comercial"}
        )

        categoryDefault.save()*/

    }

    middlewares() {
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(helmet());
        this.app.use(morgan('dev'));
    }

    routes() {
        this.app.use(this.usuarioPath, userRoutes);
        this.app.use(this.authPath, authRoutes);
        this.app.use(this.categoryPath, categoryRoutes);
        this.app.use(this.productPath, productRoutes);
        this.app.use(this.salePath, saleRoutes);
        this.app.use(this.carritoPath, carritoRoutes);
        this.app.use(this.facturaPath, facturaRoutes);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Server running on port ', this.port);
        });
    }
}

export default Server;