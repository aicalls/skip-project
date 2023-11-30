const mongoose = require("mongoose");

const wasteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

const wasteModel = mongoose.model("wastes", wasteSchema);

module.exports = { wasteModel, wasteSchema };
