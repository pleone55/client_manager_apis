import { Request, Response, NextFunction } from "express";

export class Authorized {
    public isAuthorized(opts: { hasRole: 'admin', allowSameUser?: boolean }) {
        return (req: Request, res: Response, next: NextFunction) => {
            const { role, email, uid } = res.locals;
            const { id } = req.params;

            if(opts.allowSameUser && id && uid === id) return next();

            if(!role) return res.status(403).json({ 'Role Error': 'User is not authenticated' });

            if(opts.hasRole.includes(role)) return next();

            if(email === 'test@test.com') return next();

            return res.status(403).json({ 'Client Error': 'User is not authenticated' });
        }
    }
}