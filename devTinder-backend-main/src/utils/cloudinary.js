const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

dotenv.config(); // loads CLOUDINARY_URL or individual keys

cloudinary.config(); // automatically uses CLOUDINARY_URL if present

module.exports = cloudinary;
