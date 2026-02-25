const AppError = require("../error/app-error");
const pushFileToCloudinary = require("../../utils/cloudinary-file-storage/index"); 

module.exports = {
  paperFileUploader: async (files) => {
    if (!files || !files.paper || files.paper.length === 0) {
      throw new AppError("Main paper file is required", 400);
    }

    const uploadedFiles = {};

    const uploadMultiple = async (fileArray) => {
      return Promise.all(
        fileArray.map(async (file) => {
          return await pushFileToCloudinary(file);
        })
      );
    };


    uploadedFiles.paper = (await uploadMultiple(files.paper))[0]


    if (files.figuresDetails && files.figuresDetails.length > 0) {
      uploadedFiles.figuresDetails = await uploadMultiple(files.figuresDetails);
    } else {
      uploadedFiles.figuresDetails = [];
    }


    if (files.supplementaryDetails && files.supplementaryDetails.length > 0) {
      uploadedFiles.supplementaryDetails = await uploadMultiple(files.supplementaryDetails);
    } else {
      uploadedFiles.supplementaryDetails = [];
    }

    return uploadedFiles; 
  },
};