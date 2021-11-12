const CronJob = require("cron").CronJob;
const quoteService = require("../dbops/quote.dbops");
const imageService = require("./image.service");
const postService = require("./post.service");
const fileService = require("./file.service");

let Repository = {};

Repository.dailyMorningPost = new CronJob(
  "00 07 * * *",
  async function () {
    let date = new Date();
    console.log("daily morning cron running", date);
    //* fetch random quote from db *//
    let quote = await quoteService.fetchRandom(true);
    //* generate image *//
    const imageResp = await imageService.createImageFromQuote(quote);
    if (imageResp) {
      //* host image on cloud *//
      const imageUri = await imageService.uploadImageToCloudinary(imageResp);
      if (imageUri) {
        //* create posts on social media *//
        const postResp = await postService.createPhotoPostFacebook(imageUri);
        console.log({ postResp });
        if (postResp && postResp.split(" ")[1] == "200") {
          //* delete created image *//
          fileService.deleteFile(imageResp);
          //* update quote in db *//
          quote["done"] = true;
          quoteService.upsert(quote);
        } else {
          console.log("createPhotoPostFacebook failed", postResp);
        }
      } else {
        console.log("uploadImageToCloudinary failed");
      }
    } else {
      console.log("createImageFromQuote failed");
    }
  },
  null,
  true,
  "Asia/Kolkata"
);

Repository.dailyEveningPost = new CronJob(
  "00 19 * * *",
  async function () {
    let date = new Date();
    console.log("daily evening cron running", date);
    //* fetch random quote from db *//
    let quote = await quoteService.fetchRandom(true);
    //* generate image *//
    const imageResp = await imageService.createImageFromQuote(quote);
    if (imageResp) {
      //* host image on cloud *//
      const imageUri = await imageService.uploadImageToCloudinary(imageResp);
      if (imageUri) {
        //* create posts on social media *//
        const postResp = await postService.createPhotoPostFacebook(imageUri);
        console.log({ postResp });
        if (postResp && postResp.split(" ")[1] == "200") {
          //* delete created image *//
          fileService.deleteFile(imageResp);
          //* update quote in db *//
          quote["done"] = true;
          quoteService.upsert(quote);
        } else {
          console.log("createPhotoPostFacebook failed", postResp);
        }
      } else {
        console.log("uploadImageToCloudinary failed");
      }
    } else {
      console.log("createImageFromQuote failed");
    }
  },
  null,
  true,
  "Asia/Kolkata"
);

// Repository.testingPost = new CronJob(
//   "18 22 * * *",
//   async function () {
//     let date = new Date();
//     console.log("test cron running", date);
//     //* fetch random quote from db *//
//     let quote = await quoteService.fetchRandom(true);
//     //* generate image *//
//     const imageResp = await imageService.createImageFromQuote(quote);
//     if (imageResp) {
//       //* host image on cloud *//
//       const imageUri = await imageService.uploadImageToCloudinary(imageResp);
//       if (imageUri) {
//         //* create posts on social media *//
//         const postRespInstagram = await postService.createPhotoPostInstagram(
//           imageUri
//         );
//         // const postResp = await postService.createPhotoPostFacebook(imageUri);
//         // console.log({ postResp });
//         // if (postResp && postResp.split(" ")[1] == "200") {
//         //   //* delete created image *//
//         //   fileService.deleteFile(imageResp);
//         //   //* update quote in db *//
//         //   quote["done"] = true;
//         //   quoteService.upsert(quote);
//         // } else {
//         //   console.log("createPhotoPostFacebook failed", postResp);
//         // }
//       } else {
//         console.log("uploadImageToCloudinary failed");
//       }
//     } else {
//       console.log("createImageFromQuote failed");
//     }
//   },
//   null,
//   true,
//   "Asia/Kolkata"
// );

// (async () => {
//   let quote = await quoteService.fetchRandom(true);
//   console.log(quote);
// })();

module.exports = Repository;
