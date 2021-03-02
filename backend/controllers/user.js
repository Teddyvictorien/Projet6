
const Bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const MaskData = require('maskdata')




exports.signup = (req, res, next) => {
    Bcrypt.hash(req.body.password, 10)
        .then(hash => {      
            const maskedEmail = MaskData.maskEmail2(req.body.email);
            const user = new User({
                email: maskedEmail,              
                password: hash,
                
            });
            user.save()
                .then(() => res.status(200).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    const maskedEmail = MaskData.maskEmail2(req.body.email);
    User.findOne({ email: maskedEmail })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            Bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({

                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

