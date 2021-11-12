"use strict";
const express = require("express");
const router = express.Router();
const jsonService = require("../services/json.service");
const quoteService = require("../dbops/quote.dbops");

router.post("/save", async (req, res) => {
  try {
    // pass
    if (req.body && req.body.text && req.body.text.trim()) {
      for (let key of Object.keys(req.body)) {
        if (req.body[key] && req.body[key].trim()) {
          req.body[key] = req.body[key].trim();
        } else {
          delete req.body[key];
        }
      }
      const chars = req.body.text.replace(/[\W_\s]/g, "").toLowerCase();
      const fetchResp = await quoteService.findMany({ chars });
      if (fetchResp && fetchResp.length > 0) {
        return res
          .status(409)
          .send({ status: "failed", data: "Already exists" });
      }
      let saveOptions = {
        text: req.body.text,
        chars,
      };
      if (req.body.author) {
        saveOptions["author"] = req.body.author;
        delete req.body.author;
      }
      delete req.body.text;
      if (req.body.tags && typeof req.body.tags == "string") {
        req.body.tags = req.body.tags
          .split(",")
          .map((tag) => tag.trim().toLowerCase())
          .filter((tag) => tag);
      }
      saveOptions["meta"] = req.body;
      const upsertResp = await quoteService.upsert(saveOptions);
      if (upsertResp) {
        return res.status(200).send({ status: "success", data: upsertResp });
      } else {
        return res
          .status(500)
          .send({ status: "failed", data: "Something went wrong" });
      }
    } else {
      return res
        .status(400)
        .send({ status: "failed", data: "Required fields missing" });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: "error", data: e });
  }
});

router.post("/saveBatch", async (req, res) => {
  try {
    let docs = await jsonService.readFromJSON("quotes.json");
    console.log(docs[0], typeof docs);
    docs = docs.map((doc) => {
      for (let key of Object.keys(doc)) {
        if (doc[key] && doc[key].trim()) {
          doc[key] = doc[key].trim();
        } else {
          delete doc[key];
        }
      }
      let saveOptions = {
        text: doc.text,
        chars: doc.text.replace(/[\W_\s]/g, "").toLowerCase(),
      };
      if (doc.author) {
        saveOptions["author"] = doc.author;
        delete doc.author;
      }
      delete doc.text;
      if (doc.tags && typeof doc.tags == "string") {
        doc.tags = doc.tags
          .split(",")
          .map((tag) => tag.trim().toLowerCase())
          .filter((tag) => tag);
      }
      saveOptions["meta"] = doc;
      return saveOptions;
    });
    let insertResp = await quoteService.insertMany(docs);
    if (insertResp) {
      return res.status(200).send({ status: "success", data: insertResp });
    } else {
      return res
        .status(500)
        .send({ status: "success", data: "Something went wrong" });
    }
  } catch (e) {
    console.log("saveBatch error", e);
    return res.status(500).send({ status: "error", data: e });
  }
});

router.get("/quote", async (req, res) => {
  try {
    const quote = await quoteService.fetchRandom();
    if (quote) {
      let result = {
        author: quote.author,
        text: quote.text,
      };
      if (quote.meta) {
        result.meta = quote.meta;
      }
      return res.status(200).send({ status: "success", data: result });
    }
    return res.status(404).send({ status: "failed", data: "Not found" });
  } catch (e) {
    console.log("GET /quote error", e.message);
    return res.status(500).send({ status: "error", data: e });
  }
});

module.exports = router;
