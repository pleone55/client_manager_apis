import { db } from '../util/admin';
import { Request, Response } from 'express';

export interface Client {
    name: string;
    taskDescription: string;
    dueDate: string;
    priority: string;
    price: number;
    createdAt: number;
};

export const createClientData = async(req: Request, res: Response): Promise<Response> => {
    try {
        const { name, taskDescription, dueDate, priority, price } = req.body;
        const client: Client = {
            name: name,
            taskDescription: taskDescription,
            dueDate: dueDate,
            priority: priority,
            price: price,
            createdAt: Date.now()
        };

        const collectionId = db.collection('Client').id;
        const userCollectionId = db.collection('Users').id
        const newClientData = await db.collection('Client').add(client);
        const clientId = newClientData.id;

        //Update user doc
        const clientRef = await db.collection('Client').get();
        const clientData = clientRef.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data()
        }));
        await db.collection('Users').doc('user').update({
            "clients": clientData
        });

        return res.status(201).send(
            `Collection ${collectionId} created new document with id ${clientId} and updated ${userCollectionId} doc!`
        );
    } catch (err) {
        return res.status(400).json({
            'Error': 'Could not create new document!',
            'Details': `${err}`
        });
    }
};

export const getClients = async(req: Request, res: Response): Promise<Response> => {
    try {
        const clientRef = await db.collection('Client').get();
        const clientId = db.collection('Client').id;

        if(!clientRef) return res.status(404).send(`Collection ${clientId} not found!`);

        const clientDocs = clientRef.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data()
        }));

        if(clientDocs.length === 0) return res.status(200).send(`${clientId} docs is empty!`);

        return res.status(200).json(clientDocs);
    } catch (err) {
        return res.status(400).json({
            'Error': 'Could not retrieve documents',
            'Details': `${err}`
        });
    }
};