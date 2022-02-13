const admin = require('firebase-admin');
const saltedMd5 = require('salted-md5');
const path = require('path');
const serviceAccount = require('../../serviceAccountKey.json');

if (admin.apps.length === 0) {
   admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
   });
}

exports.storageImage = async ({ originalname, buffer }) => {
   const newName = saltedMd5(originalname, 'SUPER-S@LT!');
   const fileName = newName + path.extname(originalname);
   await admin.storage().bucket().file(fileName).createWriteStream()
      .end(buffer);
   return admin.storage().bucket().file(fileName).getSignedUrl({
      action: 'read',
      expires: '03-09-2491',
   })
      .then((data) => data[0]);
};
