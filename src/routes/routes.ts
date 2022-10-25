import { Authenticated } from '../middleware/authenticated';
import { Authorized } from '../middleware/authorized';
import { Router, Application } from 'express';
import { loginUser, signUpUser, signOutUser } from '../controllers/user';
import { getClients, createClientData } from '../controllers/client';

const router = Router();
const authenticated = new Authenticated();
const authorized = new Authorized();


router.post('/user/new',
    signUpUser
);
router.post('/user', [
    authenticated.isAuthenticated,
    authorized.isAuthorized({ hasRole: 'admin' }),
    loginUser
]);
router.post('/user/signout', [
    authenticated.isAuthenticated,
    authorized.isAuthorized({ hasRole: 'admin' }),
    signOutUser
]);

export { router };

// // User routes
// router.get('/user', auth.firebaseAuth, getUserData);
// router.post('/user/new', signUpUser);
// // router.post('/user/signin', signInUser);

// // Client routes
// router.get('/client', auth.firebaseAuth, getClients);
// router.post('/client/new', auth.firebaseAuth, createClientData);