const { Router } = require('express');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

const UserController = require('./app/controllers/UserController');

const router = Router();

router.get('/users', UserController.index);
router.get('/users/:id', UserController.show);
router.delete('/users/:id', UserController.delete);
router.post('/users', upload.single('image'), UserController.store);
router.put('/users/:id', upload.single('image'), UserController.update);

module.exports = router;
