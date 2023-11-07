const multer = require("multer");
const path = require("path");

// Définition des types MIME autorisés et de leurs extensions correspondantes
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// Configuration du stockage des fichiers avec Multer
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images"); // Le dossier de destination où les fichiers seront enregistrés
  },
  filename: (req, file, callback) => {
    const nameWithoutExt = path.basename(
      file.originalname,
      path.extname(file.originalname)
    ); // Nom du fichier sans extension
    const name = nameWithoutExt.split(" ").join("_"); // Nom du fichier avec les espaces remplacés par des underscores
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage }).single("image");
