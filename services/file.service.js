const fs = require("fs");
const path = require("path");

let Repository = {};

Repository.deleteFile = (file) => {
  try {
    const filePath = path.join(__dirname, "../" + file);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.log("deleteFile error", err);
      } else {
        console.log("deleteFile success", filePath);
      }
    });
  } catch (e) {
    console.log("deleteFile error", e);
  }
};

module.exports = Repository;
