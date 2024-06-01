const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  instructions: { type: String, default: "" },
  paytype: { type: String, required: true },
  skipsize: { type: String, required: true },
  postcode: { type: String, required: true },
  availability: { type: Object, required: true },
  price: { type: Number, required: true, default: 0 },
  wasteitem: { type: Array, required: true },
  wastequantity: { type: Array, required: true },
  weekcount: {
    type: Number,
    default: 1,
  },
  permitprice: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Orders = mongoose.model("orders", orderSchema);

module.exports = Orders;
