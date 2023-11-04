// Importation du module HTTP et de l'application Express
const http = require("http"); // Module HTTP de base
const app = require("./app"); // L'application Express

// Fonction pour normaliser le numéro de port
const normalizePort = (val) => {
  const port = parseInt(val, 10); // Analyse le numéro de port en tant qu'entier décimal

  if (isNaN(port)) {
    return val; // Si ce n'est pas un nombre, retourner la valeur
  }
  if (port >= 0) {
    return port; // Si le numéro de port est valide, le retourner
  }
  return false;
};

// Configuration du port d'écoute du serveur en fonction de la variable d'environnement PORT ou par défaut 4000
const port = normalizePort(process.env.PORT || "4000");
app.set("port", port);

// Gestion des erreurs liées à l'écoute du serveur
const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Création du serveur HTTP en utilisant l'application
const server = http.createServer(app);

// Gestion des erreurs du serveur
server.on("error", errorHandler);
// Événement "listening" lorsque le serveur est prêt à écouter
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

// Le serveur écoute sur le port configuré
server.listen(port);
