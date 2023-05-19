const multer = require("multer");
const path = require("path");

// Define storage settings for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets/img/webUpload/"); // Specify the directory where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    // Generate a unique file name for the uploaded file
    const uniqueSuffix =
      new Date()
        .toISOString()
        .replace(/T.*/, "")
        .split("-")
        .reverse()
        .join("-") +
      "-" +
      Math.round(Math.random() * 1e4);
    const originalName = path.parse(file.originalname).name; // Get the original file name
    const extension = file.originalname.split(".").pop(); // Get the file extension
    const fileName = uniqueSuffix + "-" + originalName + "." + extension;
    cb(null, fileName);
  },
});

// Create the multer instance with the storage settings
const upload = multer({ storage: storage });

module.exports = upload;
