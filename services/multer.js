const multer = require("multer");
const path = require("path");
const { nanoid } = require("nanoid");
const fs = require("fs");

const validationFile = {
  imageFile: ["image/jpeg", "image/jpg", "image/gif", "image/png"],
  textFile: ["application/pdf"],
  attFile: [
    "image/jpeg",
    "image/jpg",
    "image/gif",
    "image/png",
    "application/pdf",
    "video/mp4",
    "audio/mpeg",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ],
};
function myMulter(customPath, validationFileType) {
  const fullPath = path.join(__dirname, `../uploads/${customPath}`);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
  const storage = multer.diskStorage({
    destination: function (req, file, callback) {
      req.destinationFile = `uploads/${customPath}`;
      callback(null, fullPath);
    },
    filename: function (req, file, callback) {
      const fullFileName = nanoid() + "_" + file.originalname;
      callback(null, fullFileName);
    },
  });
  const fileFilter = function (req, file, callback) {
    //const fileSize = parseInt(req.headers["content-length"]); ////By Ahmad Alabed
    if (validationFileType.includes(file.mimetype)) {
      req.imageError = false;
      callback(null, true);
    } else {
      req.imageError = true;
      callback(null, false, req.imageError); // false => don't continue
    }
  };

  const upload = multer({
    dest: fullPath,
    fileFilter,
    storage,
    limits: { fileSize: 3145728 }, ////By Ahmad Alabed
  });

  return upload;
}
module.exports = { myMulter, validationFile };
