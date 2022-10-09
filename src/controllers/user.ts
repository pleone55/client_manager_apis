import { db } from '../util/admin';
import { Request, Response } from 'express';
import { Client } from './client';

// type Client = {
//     name: string;
//     taskDescription: string;
//     dueDate: string;
//     priority: string;
//     price: number;
//     createdAt: number;
// };

interface User {
    name: string;
    email: string;
    password: string;
    clients: Array<Client>;
    createdAt: number;
}

export const createUserData = async(req: Request, res: Response): Promise<Response> => {
    try {
        const clientEntries: Client[] = [];
        const { name, email, password } = req.body;
        const clientRef = await db.collection('Client').get();
        clientRef.forEach((doc: any) => (
            clientEntries.push(doc.data())
        ));

        const collectionId = db.collection('Users').id;
        const userRefSize = (await db.collection('Users').get()).size;
        if(userRefSize === 1) return res.status(404).send(`${collectionId} exceeds max number of users. Could not create!`)

        //Only one user will be using the app so all clients will go to that user
        //May change later...
        const user: User = {
            name: name,
            email: email,
            password: password,
            clients: clientEntries,
            createdAt: Date.now()
        };

        const userRef = db.collection('Users');
        await userRef.doc('user').set(user);

        return res.status(201).send(`Collection ${collectionId} created new document!`);
    } catch (err) {
        return res.status(400).json({
            'Error': 'Could not create new document!',
            'Details': `${err}`
        });
    }
};

export const getUserData = async(req: Request, res: Response): Promise<Response> => {
    try {
        const userRef = await db.collection('Users').get();
        const userId = db.collection('Users').id;

        if(!userRef) return res.status(404).send(`Collection ${userId} not found!`);

        const userDocs = userRef.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data()
        }));

        if(userDocs.length === 0) return res.status(200).send(`${userId} docs is empty!`);

        return res.status(200).json(userDocs);
    } catch (err) {
        return res.status(400).json({
            'Error': 'Could not retrieve documents!',
            'Details': `${err}`
        });
    }
};

// const userConverter = {
//     toFirestore: (user) => {
//         return {
//             id: user.id,
//             name: user.name,
//             email: user.email,
//             password: user.password,
//             clients: user.clients
//         };
//     },
//     fromFirestore: (snapshot, options) => {
//         const data = snapshot.data(options);
//         return new User(data.id, data.name, data.email, data.password, data.clients);
//     } 
// };