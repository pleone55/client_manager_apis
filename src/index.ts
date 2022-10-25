import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { router } from './routes/routes';

dotenv.config();
const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', router );

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`[server]: Now listening on port ${PORT}`);
});