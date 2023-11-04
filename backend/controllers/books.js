const Book = require("../models/Book");
const sharp = require("sharp");
const fs = require("fs");

// Utilisation de Sharp pour redimensionner et compresser l'image
sharp("image.jpg")
  .resize(300, 200) // Redimensionne l'image à une largeur de 300 pixels et une hauteur de 200 pixels
  .jpeg({ quality: 80 }) // Comprime l'image en format JPEG avec une qualité de 80 %
  .toFile("resized_and_compressed_image.jpg", (err, info) => {
    if (err) {
      console.error(err);
    }
  });

// Crée un nouveau livre
exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  book
    .save()
    .then(() => {
      res.status(201).json({ message: "Livre enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// Met à jour un livre
exports.modifyBook = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  delete bookObject._userId;
  // Vérifie si l'utilisateur est autorisé à modifier le livre
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        // Effectue la mise à jour du livre
        Book.updateOne(
          { _id: req.params.id },
          { ...bookObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Livre modifié!" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// Supprime un livre
exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Livre supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

// Récupère les détails d'un livre spécifique
exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

// Récupère la liste de tous les livres
exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

// Ajoute une note à un livre et calcule la note moyenne
exports.rating = (req, res, next) => {
  const userId = req.auth.userId;
  const { rating } = req.body;
  const userRating = { userId, grade: rating };

  Book.findByIdAndUpdate(
    { _id: req.params.id },
    { $push: { ratings: userRating } },
    { new: true }
  )
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: "Livre non trouvé" });
      }

      // Calculer la nouvelle note moyenne

      const totalRatings = book.ratings.length;
      const totalRatingSum = book.ratings.reduce(
        (sum, rating) => sum + rating.grade,
        0
      );

      book.averageRating = totalRatingSum / totalRatings;

      book
        .save()
        .then((book) => {
          res.status(200).json(book);
        })
        .catch((error) => {
          res.status(400).json({ error });
        });
    })
    .catch((error) => {
      res.status(500).json({
        error: "Une erreur s'est produite lors de la mise à jour de la note.",
      });
    });
};

exports.bestRating = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 }) // Tri par ordre décroissant de la note moyenne
    .limit(3) // Limiter les résultats aux trois premiers
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};
