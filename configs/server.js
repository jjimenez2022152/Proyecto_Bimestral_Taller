'use strict'

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { dbConnection } from './mongo.js';
import userRoutes from '../src/users/user.routes.js';
import authRoutes from '../src/auth/auth.routes.js'
import User from "../src/users/user.model.js";
import bcryptjs from 'bcryptjs';

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuarioPath = '/proyectoBim/v1/users'
        this.authPath = '/proyectoBim/v1/auth'

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
        this.app.use(this.authPath, authRoutes)
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Server running on port ', this.port);
        });
    }
}

export default Server;