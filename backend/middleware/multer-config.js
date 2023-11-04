const multer = require("multer");

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
    const name = file.originalname.split(" ").join("_"); // Nom du fichier avec les espaces remplacés par des underscores
    const extension = MIME_TYPES[file.mimetype]; // Extension du fichier basée sur le type MIME
    callback(null, name + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage }).single("image");
