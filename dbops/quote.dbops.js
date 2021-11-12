const Model = require("../models/quote.model");
const Repository = {};

Repository.findMany = (options = {}) => {
  return new Promise((resolve, reject) => {
    try {
      console.log("find", options);
      Model.find(options)
        .sort({ _id: -1 })
        .lean()
        .exec((err, data) => {
          console.log("resolve before" + err);
          console.log(data);
          if (!data || (data && data.length <= 0)) {
            return resolve([]);
          }
          console.log("resolve Model");
          return resolve(data);
        });
    } catch (e) {
      console.log(e);
      return reject(e);
    }
  });
};

Repository.fetchRandom = (once = false) => {
  return new Promise((resolve, reject) => {
    try {
      let options = [{ $sample: { size: 1 } }];
      if (once) {
        options.unshift({ $match: { done: false } });
      }
      console.log("fetching random doc with options", options);
      Model.aggregate(options).exec((err, data) => {
        // console.log("resolve before" + err);
        console.log(data);
        if (!data || (data && data.length === 0)) {
          return resolve(null);
        }
        console.log("resolve data");
        return resolve(data[0]);
      });
    } catch (e) {
      console.log(e);
      return reject(e);
    }
  });
};

Repository.upsert = (data) => {
  return new Promise((resolve, reject) => {
    try {
      // console.log("to be updated model =>", data);
      let newData = JSON.parse(JSON.stringify(data));
      if ("_id" in newData) {
        delete newData._id;
      }
      Model.findOneAndUpdate(
        { chars: data.chars },
        { $set: newData },
        { upsert: true, new: true }
      )
        .lean()
        .exec((err, msg) => {
          //   console.log("resolve before findOneAndUpdate" + err);
          // console.log(data);
          if (err) {
            console.log("upsert err", err.message);
            return reject(err);
          }
          if (!msg || (msg && msg.length <= 0)) {
            return resolve(err);
          }
          //   console.log("resolve updated data", msg);
          return resolve(msg);
        });
    } catch (err) {
      console.log(err);
      return reject(err);
    }
  });
};

Repository.insertMany = (docs) => {
  return new Promise((resolve, reject) => {
    console.log("inserting", docs.length, "documents");
    Model.insertMany(docs, { ordered: false })
      .then((data) => {
        console.log("Data inserted");
        return resolve(data);
      })
      .catch(function (e) {
        console.log("insertMany error", e.message);
        return reject(e);
      });
  });
};

Repository.deleteMany = (options = {}) => {
  return new Promise((resolve, reject) => {
    Model.deleteMany(options)
      .then(() => {
        console.log("Data deleted");
        return resolve("success");
      })
      .catch(function (error) {
        console.log(error);
        return reject(error);
      });
  });
};

module.exports = Repository;
