import { db } from '../util/admin';
import { Request, Response } from 'express';
import { Client } from './client';
import admin from 'firebase-admin';
import { auth, signInWithEmailAndPassword, getIdToken, signOut } from '../util/firebase';

interface User {
    name: string;
    email: string;
    password: string;
    role: string;
    clients: Array<Client>;
    createdAt: admin.firestore.FieldValue;
}

export const signUpUser = async(req: Request, res: Response): Promise<Response> => {
    try {
        const clientEntries: Client[] = [];
        const role = 'admin';

        const { name, email, password } = req.body;
        if(!name || !email || !password) return res.status(400).json({ 'Error': 'Missing fields' });

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
            role: role,
            clients: clientEntries,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        };

        const { uid } = await admin.auth().createUser({
            displayName: user.name,
            email: user.email,
            password: user.password,
            emailVerified: false,
            disabled: false,
        });

        await admin.auth().setCustomUserClaims(uid, { role });

        const userRef = db.collection('Users');
        await userRef.doc('user').set(user, { merge: true });

        return res.status(201).send(`Collection ${collectionId} created new document!`);
    } catch (err) {
        return res.status(400).json({
            'Error': 'Could not create new document!',
            'Details': `${err}`
        });
    }
};

export const loginUser = async(req: Request, res: Response): Promise<Response> => {
    try {
        const { email, password } = req.body;
        if(!email || !password) return res.status(400).json({ 'Error': 'Missing Credentials!' });

        await signInWithEmailAndPassword(auth, email, password);

        const token = await auth.currentUser?.getIdToken(true);
        const userRef = await db.collection('Users').get();
        const userId = db.collection('Users').id;

        if(!userRef) return res.status(404).send(`Collection ${userId} not found!`);

        const userDocs = userRef.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data()
        }));

        if(userDocs.length === 0) return res.status(200).send(`${userId} docs is empty!`);

        return res.status(200).json({ userDocs, token });
    } catch (err: any) {
        return res.status(404).json({
            'Error': 'Could not retrieve documents!',
            'Details': `${err}`
        });
    }
};

export const signOutUser = async(req: Request, res: Response): Promise<Response> => {
    try {
        await signOut(auth);
        return res.status(200).json({ 'Success': 'Successfully signed out!' });
    } catch (err) {
        return res.status(500).json({
            'Error': 'Could not sign out!',
            'Details': `${err}`
        });
    }
};
