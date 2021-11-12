const mongoose = require("mongoose");

let db = {};

db.connect = function () {
  mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true,
    })
    .then(
      function () {
        console.log("successfully connected to the database!");
      },
      function (err) {
        console.log(err);
        console.log(
          "Could not connect to the database! Check your connection.."
        );
        process.exit(1);
      }
    );
};

module.exports = db;
