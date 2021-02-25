const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('..//middleware/multer-config');

const sauceCtrl = require('../controllers/sauce');

router.get('/', auth, sauceCtrl.getAllSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth,  sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifyOneSauce);
router.delete('/:id', auth, sauceCtrl.deleteOneSauce);
router.post('/:id/like', auth, sauceCtrl.likeOneSauce);


module.exports = router;