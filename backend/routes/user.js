const express = require('express');
const router = express.Router();
const ExpressBrute = require('express-brute');

const userCtrl = require('../controllers/user');

var store = new ExpressBrute.MemoryStore(); // stores state locally, don't use this in production
var bruteforce = new ExpressBrute(store, {
    freeRetries: 5,
    minWait: 5601000, // 5 minutes
    maxWait: 60601000, // 1 hour,
});

router.post('/signup', userCtrl.signup);
router.post('/login',bruteforce.prevent, userCtrl.login);

module.exports = router;