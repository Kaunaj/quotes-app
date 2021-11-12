const path = require("path");
const { exec } = require("child_process");

let Repository = {};

Repository.createPhotoPostFacebook = (uri) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(
        "executing",
        `curl -i -X POST "https://graph.facebook.com/1291477604316104/photos?url=${uri}&access_token=${process.env.FB_PAGE_ACCESS_TOKEN}"`
      );
      exec(
        `curl -i -X POST "https://graph.facebook.com/1291477604316104/photos?url=${uri}&access_token=${process.env.FB_PAGE_ACCESS_TOKEN}"`,
        (error, stdout, stderr) => {
          if (error !== null) {
            console.log(`exec error: ${error} ${stderr}`);
            reject(error, stderr);
          }
          resolve(stdout);
        }
      );
    } catch (e) {
      console.log("createPhotoPostFacebook error", e.message);
      return reject(null);
    }
  });
};

Repository.createPhotoPostInstagram = (uri) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(
        "executing: upload photo\n",
        `curl -i -X POST "graph.facebook.com/${
          process.env.INSTAGRAM_USER_ID
        }/media?image_url=${uri.replace(/.png/g, ".jpg")}"`
      );
      exec(
        `curl -i -X POST "graph.facebook.com/${
          process.env.INSTAGRAM_USER_ID
        }/media?image_url=${uri.replace(/.png/g, ".jpg")}"`,
        (error, stdout, stderr) => {
          if (error !== null) {
            console.log(`exec error: ${error} ${stderr}`);
            reject(error, stderr);
          }
          console.log("ig post resp", stdout);
          resolve(stdout);
          // console.log(
          //   "obtained containerID, executing: publish photo\n",
          //   `curl -i -X POST "graph.facebook.com/${containerID}/media
          //   ?image_url=${uri}
          //   &caption=%23DailyMotivation"`
          // );
          // exec(
          //   `curl -i -X POST "graph.facebook.com/${process.env.INSTAGRAM_USER_ID}/media
          //   ?image_url=${uri}
          //   &caption=%23DailyMotivation"`,
          //   (error, stdout, stderr) => {
          //     if (error !== null) {
          //       console.log(`exec error: ${error} ${stderr}`);
          //       reject(error, stderr);
          //     }

          //     resolve(stdout);
          //   }
          // );
        }
      );
    } catch (e) {
      console.log("createPhotoPostFacebook error", e.message);
      return reject(null);
    }
  });
};

module.exports = Repository;
