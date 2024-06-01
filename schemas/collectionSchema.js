const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const collectionsSchema = new Schema({
  orderId: { type: String, required: true },
  requestDate: { type: Date, required: true },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Collections = mongoose.model("collections", collectionsSchema);

module.exports = Collections;
