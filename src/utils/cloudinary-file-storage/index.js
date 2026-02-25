const cloudinary = require("./cloudinary.config");

const pushFileToCloudinary = async (file) => {
  const fileName = Date.now() + "-" + file.originalname.replace(/\s+/g, "-");

  const options = {
    folder: "profile_images",
    use_filename: true,
    unique_filename: true,
    overwrite: false,
    public_id: fileName,
    resource_type: "auto",
  };

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error);
        resolve({
          name: file.originalname,
          url: result.secure_url,
        });
      },
    );

    stream.end(file.buffer);
  });
};

module.exports = pushFileToCloudinary;
