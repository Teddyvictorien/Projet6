const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique : true},
    password: { type: String, required: true, validated: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+.!*$@%_])([-+!.*$@%_\w]{8,80})$/ },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);