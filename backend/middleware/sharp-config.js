const sharp = require("sharp");

// Utilisation de Sharp pour redimensionner et compresser l'image
sharp("../images/image.jpg")
  .resize(300, 200) // Redimensionne l'image à une largeur de 300 pixels et une hauteur de 200 pixels
  .jpeg({ quality: 80 }) // Comprime l'image en format JPEG avec une qualité de 80 %
  .toFile("resized_and_compressed_image.jpg", (err, info) => {
    if (err) {
      console.error(err);
    }
  });
