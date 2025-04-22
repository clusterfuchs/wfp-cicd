import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import eventRoute from './routes/Event'
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import cors from 'cors';

const compression = require('compression');
const app: Express = express();

const options = {
definition: {
        openapi: '3.0.0',
        info: {
        title: 'TV Klosterneuburg Calendar',
        version: '1.0.0',
        description: 'API documentation for TV KLBG Calendar',
        },
  },
  apis: ['./src/routes/Event.ts'], // Path to the API routes
};

dotenv.config();

const swaggerSpec = swaggerJsdoc(options);
const port = 3000;

app.use(compression());
app.use(express.json());

app.get('/', (req: Request, res: Response) =>{
    res.send("Hello World!!");
})

app.use(cors());
app.use('/events', eventRoute);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

mongoose.connect(process.env.MONGODB_URL ?? '')
    .then(() =>{
        app.listen(port, () =>{
            console.log("Listening on Port " + port);
        })
    })
    .catch(() =>{
        console.log("Error!")
    });