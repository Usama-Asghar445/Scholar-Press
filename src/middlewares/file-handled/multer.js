const multer = require("multer");

const storage = multer.memoryStorage();

const validateFileType = (file, cb) => {
  const allowedType = [

    // Images
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",

    // Documents
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

  ];

  if (allowedType.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

const fileFilter = (req, file, cb) => {
  validateFileType(file, cb);
};

const limits = {
  fileSize: 5 * 1024 * 1024 // 5MB
};

const upload = multer({
  storage,
  fileFilter,
  limits
});

module.exports = upload;