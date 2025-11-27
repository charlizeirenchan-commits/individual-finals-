const { validationResult } = require("express-validator");
const getCoordsForAddress = require("../util/geocode");
const Journal = require("../models/journal");
const HttpError = require("../models/http-error");

const getEntriesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  console.log("Fetching entries for user:", userId);

  let entries;
  try {
    entries = await Journal.find({ author: userId });
    console.log("Database result:", entries);
  } catch (err) {
    const error = new HttpError(
      "Fetching entries failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!entries) {
    return next(
      new HttpError(
        "Could not find entries for the provided user id.",
        404
      )
    );
  }

  res.json({ entries: entries.map(e => e.toObject({ getters: true })) });
};

exports.getEntriesByUserId = getEntriesByUserId;

exports.getEntryById =
  require("./journal-controllers").getEntryById || null;
