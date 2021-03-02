const express = require('express');
const router = express.Router();
const ExpressBrute = require('express-brute');
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+.!*$@%_])([-+!.*$@%_\w]{8,80})$/;

const userCtrl = require('../controllers/user');


function checkPassword(req, res, next) {
    if (!passwordRegex.test(req.body.password)) {
        return res.status(400).json({ error : 'Mot de passe non conforme' });
    } else {
        return next();
    } 
}

var store = new ExpressBrute.MemoryStore(); // stores state locally, don't use this in production
var bruteforce = new ExpressBrute(store, {
    freeRetries: 5,
    minWait: 5601000, // 5 minutes
    maxWait: 60601000, // 1 hour,
});

router.post('/signup', checkPassword, userCtrl.signup);
router.post('/login',bruteforce.prevent, userCtrl.login);

module.exports = router;