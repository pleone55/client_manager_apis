import admin from 'firebase-admin';
const serviceAccount = require("../../client-manager-e16a6-firebase-adminsdk-ts4tm-663f56deb4.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
export { admin, db };