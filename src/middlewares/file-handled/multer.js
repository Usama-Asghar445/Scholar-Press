const multer = require("multer");

const storage  = multer.diskStorage({
  filename:(req,file,cb)=>{
    cb(null ,Date.now()+"-"+file.originalname)
  }
})

const validateFileType = (file, cb) => {
  const allowedType = [
    // Images
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/svg+xml", // SVG
    "image/tiff", // TIFF
    "image/avif", // AVIF
    "image/webp", // WEBP

    // Documents
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];
  if(allowedType.includes(file.mimetype)){
    cb(null,true)
  }else{
    
  }
};



multer({
  storage,
  fileFilter,
  limits,
  preservePath,
})