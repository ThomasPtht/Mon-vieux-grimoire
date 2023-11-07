const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const User = require("../models/User");

// Route pour l'inscription d'un nouvel utilisateur
exports.signup = (req, res, next) => {
  // Hachage du mot de passe
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      // Création d'un nouvel utilisateur avec l'adresse e-mail et le mot de passe haché
      const user = new User({
        email: req.body.email,
        password: hash,
      });

      // Enregistrement de l'utilisateur dans la base de données
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// Route pour la connexion d'un utilisateur
exports.login = (req, res, next) => {
  // Recherche de l'utilisateur par adresse e-mail dans la base de données
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user === null) {
        res
          .status(401)
          .json({ message: "Paire identifiant/mot de passe incorrecte" });
      } else {
        // Comparaison du mot de passe fourni avec le mot de passe haché de l'utilisateur
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              res
                .status(401)
                .json({ message: "Paire identifiant/mot de passe incorrecte" });
            } else {
              // Création d'un jeton JWT pour l'authentification
              res.status(200).json({
                userId: user._id,
                token: jwt.sign({ userId: user._id }, jwtSecret, {
                  expiresIn: "1h",
                }),
              });
            }
          })
          .catch((error) => res.status(500).json({ error }));
      }
    })
    .catch((error) => res.status(500).json({ error }));
};
