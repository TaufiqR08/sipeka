 // Jalankan Next.js standalone di port 8080

process.env.PORT = process.env.PORT || 8080;
process.env.HOSTNAME = "0.0.0.0";

// Path ke server standalone Next.js
const path = require("path");
const server = path.join(__dirname, ".next/standalone/server.js");

// Jalankan server bawaan Next.js
require(server);
