import express, { Express } from 'express';
import dotenv from 'dotenv';
import { getUserData, createUserData } from './controllers/user';
import { createClientData, getClients } from './controllers/client';

dotenv.config();
const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`[server]: Now listening on port ${PORT}`);
});

app.get('/api/users', getUserData);
app.post('/api/user/new', createUserData);
app.post('/api/client/new', createClientData)
app.get('/api/clients', getClients);