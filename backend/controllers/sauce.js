const Sauce = require('../models/sauce');
const fs = require('fs');

//request post to create new sauce  

exports.createSauce = (req, res, next) => {
    //console.log(req);
    let sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    delete sauceObject.id;
    sauce.save().then(
        () => {
            res.status(201).json({ message: 'Saved succesfully !' });
        }
    ).catch((error) => {
        res.status(400).json({ error });
    })
};

//request get to get one sauce

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
    _id: req.params.id
    }).then(
        (sauce) => {
                res.status(200).json(sauce);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                    error: error
            });
        }
    );
}

//request put to modify one sauce

exports.modifyOneSauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => {
            res.status(201).json({ message: 'Updated succesfully !' });
        }
        ).catch(
            (error) => {
                res.status(400).json({ error: error });
            }
        );
};

//request delete to delete one sauce

exports.deleteOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => {
                        res.status(200).json({ message: 'Deleted !' });
                    })
                    .catch((error) => {
                        res.status(400); json({ error });
                    });
            });
        })
        .catch(error => res.status(500).json({ error }));
};

//request get to get all of sauces 

exports.getAllSauce = (req, res, next) => {
    Sauce.find().then(
        (sauces) => {
            res.status(200).json(sauces);
        })
    .catch(
        (error) => {
            res.status(400).json({ error: error });
        }
    );
};

//request post to likes

exports.likeOneSauce = (req, res, next) => {
    let userId = req.body.userId;
    let like = req.body.like;

    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            var statusMessage = "";
            if (like == 1) {
                if (sauce.usersLiked.indexOf(userId) == -1) {
                    sauce.likes++;
                    console.log(sauce.likes)
                    sauce.usersLiked.push(userId);
                    console.log(sauce.usersLiked)
                    statusMessage = " Vous aimez cette sauce !";
                };
            } if (like == 0) {
                if (sauce.usersLiked.indexOf(userId) !== -1) {
                    sauce.likes--;
                    console.log(sauce.likes)
                    sauce.usersLiked.splice(sauce.usersLiked.indexOf(userId), 1)
                    console.log(sauce.usersLiked)
                    statusMessage = " Votre vote est annulé !";
                } if (sauce.usersDisliked.indexOf(userId) !== -1) {
                    sauce.dislikes--;
                    console.log(sauce.dislikes)
                    sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(userId), 1);
                    console.log(sauce.usersDisliked)
                    statusMessage = " Votre vote est annulé !";
                };
            } if (like == -1) {
                if (sauce.usersDisliked.indexOf(userId) == -1) {
                    sauce.dislikes++;
                    console.log(sauce.dislikes)
                    sauce.usersDisliked.push(userId);
                    console.log(sauce.usersDisliked)
                    statusMessage = " Vous n'aimez pas cette sauce !";
                };
            }
            sauce.save()
            .then(() => {
                res.status(201).json({ message: statusMessage });
                console.log(statusMessage)
            }
            ).catch((error) => {
                res.status(400).json({ error });
            })
        });
};