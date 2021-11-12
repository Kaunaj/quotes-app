const fs = require("fs");
const path = require("path");
const textToImage = require("text-to-image");

let Repository = {};

Repository.readFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    try {
      fs.readFile(file, "utf8", function (err, data) {
        if (err) {
          console.log("json read error", err);
          return reject(err);
        }
        return resolve(JSON.parse(data));
      });
    } catch (e) {
      return reject(e);
    }
  });
};

Repository.writeToJSON = (newData, file) => {
  return new Promise((resolve, reject) => {
    try {
      fs.writeFileSync(file, JSON.stringify(newData, null, 2));
      return resolve();
    } catch (e) {
      console.log("writeToJSON error", e.message);
      return reject(e);
    }
  });
};

Repository.appendToJSON = (newData, file) => {
  return new Promise((resolve, reject) => {
    try {
      fs.readFile(file, function (err, data) {
        if (err) {
          console.log("json read error", err);
          return reject(err);
        }
        let obj = JSON.parse(JSON.stringify(data));
        console.log({ obj });

        Object.entries(newData).forEach((el) => {
          let key = el[0];
          let value = el[1];
          obj[key] = value;
        });

        try {
          fs.writeFileSync(file, JSON.stringify(obj, null, 4));
        } catch (err) {
          // An error occurred
          console.error("json write error", err);
          return reject(err);
        }
      });
    } catch (e) {
      return reject(e);
    }
  });
};

Repository.formatJSON = (jsonList) => {
  let returnList = [];
  for (let jsonObject of jsonList) {
    let json = {};
    for (let myKey of Object.keys(jsonObject)) {
      let originalKey = myKey;
      myKey = myKey
        .trim()
        .toLowerCase()
        .replace(/\./g, "")
        .replace(/\s+/g, " ")
        .replace(/\s/g, "_")
        .replace(/\//g, "_");
      if (String(jsonObject[originalKey]).trim()) {
        json[myKey] = String(jsonObject[originalKey]).trim();
      }
    }
    returnList.push(json);
  }
  return returnList;
};

module.exports = Repository;
