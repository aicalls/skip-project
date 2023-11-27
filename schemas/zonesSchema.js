const mongoose = require('mongoose');

const pricingSchema = new mongoose.Schema({
  skipType: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const zoneSchema = new mongoose.Schema({
  zone: {
    type: String,
    required: true,
  },
  postCodes: {
    type: [String],
    required: true,
  },
  prices: {
    type: [pricingSchema], // Embedding the pricing schema as an array
    required: true,
  },
});

const ZoneModel = mongoose.model('Zone', zoneSchema);

module.exports = ZoneModel;
