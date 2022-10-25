import * as admin from 'firebase-admin';
import { Request, Response, NextFunction } from 'express';

export class Authenticated {
    public async isAuthenticated(req: Request, res: Response, next: NextFunction) {
        const { authorization } = req.headers;
        const split = authorization?.split('Bearer');

        if(!authorization || !authorization.startsWith('Bearer') || split?.length !== 2) {
            return res.status(401).json({ 'Client Error': 'Unauthorized' });
        }

        const token = split[1].trim();
        try {
            const decodedToken: admin.auth.DecodedIdToken = await admin.auth().verifyIdToken(token);
            console.log(`decodedToken: ${JSON.stringify(decodedToken)}`);
            res.locals = { ...res.locals, uid: decodedToken.uid, role: decodedToken.role, email: decodedToken.email }
            console.log(res.locals);
            return next();
        } catch (err: any) {
            console.error(`${err.code} - ${err.message}`);
            return res.status(401).json({ 'Unauthorized': `${err.message}` });
        }
    }
}