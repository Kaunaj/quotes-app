const path = require("path");
const textToImage = require("text-to-image");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const { fonts } = require("./font.service");

let Repository = {};

const randomNum = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

Repository.createImageFromQuote = (quote) => {
  return new Promise(async (resolve, reject) => {
    try {
      // quote = {
      //   text: "I would maintain that thanks are the highest form of something and gratitude is happiness doubled or something.",
      //   author: "Kaunaj Banerjee",
      // };
      const txt = quote.text + "\n\n- " + quote.author;
      const fileName = "quote.jpg";
      const font = fonts[randomNum(0, fonts.length)];
      console.log("random font selected", font);
      const dataUri = await textToImage.generate(txt, {
        debug: true,
        debugFilename: fileName,
        maxWidth: 768,
        customHeight: 432,
        fontSize: font.fontSize,
        fontFamily: font.fontName,
        fontPath: path.join(__dirname, `../assets/fonts/${font.fontPath}`),
        lineHeight: 40,
        margin: 20,
        bgColor: "#111",
        textColor: "#fff",
        textAlign: "center",
        verticalAlign: "center",
      });
      return resolve(fileName);
    } catch (e) {
      console.log("createImageFromText error", e.message);
      return reject(null);
    }
  });
};

Repository.uploadImageToCloudinary = (fileName) => {
  return new Promise(async (resolve, reject) => {
    try {
      const filePath = path.join(__dirname, "..", fileName);
      console.log("uploading", filePath);
      cloudinary.uploader.upload(filePath, function (err, result) {
        if (err) {
          console.log("uploadImageToCloudinary error", err);
          return reject(null);
        } else {
          console.log("uploadImageToCloudinary success", result);
          return resolve(result.secure_url);
        }
      });
    } catch (e) {
      console.log("uploadImageToCloudinary error", e.message);
      return reject(null);
    }
  });
};

module.exports = Repository;
