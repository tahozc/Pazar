const cloudinary = require("cloudinary").v2;

exports.cloudinaryUpload = async (image) => {
  let imageUrl = "";
  if (image) {
    cloudinary.config({
      cloud_name: "dbbxybdvu",
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    try {
      const result = await cloudinary.uploader.upload(image.tempFilePath);
      imageUrl = result.url;
    } catch (error) {
      console.error(error);
    }
  }
  return { imageUrl };
};
