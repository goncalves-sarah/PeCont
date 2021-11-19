import express, { Request, Response, NextFunction} from 'express'
import swaggerUi from 'swagger-ui-express';
import swaggerFile from './swagger.json';

import "reflect-metadata";
import "express-async-errors";

//import cors from "cors";

import './database';
import { router } from './routes';
import { Errors } from './errors';

const app = express();
//app.use(cors());

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(router);

//Middleware para verificar erros
//Tem que vir após as routes, pois o erro foi lançado lá
//Middleware fica entra a req e a res
app.use((err : Errors, req : Request, res : Response, next: NextFunction) => {
    if(err instanceof Error){ // o tipo de erro que lançamos no Controller
        return res.status(err.status).json({
            error: err.message
        });
    }

    return res.status(500).json({
        status: "error",
        message: "Internal Server Error"
    })
});

app.listen(8000,() => {
    console.log("Server is running!");
});