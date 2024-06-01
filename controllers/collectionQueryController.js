const { accessGoogleSheet } = require("../config/googleSheetConfiguration");
const Orders = require("../schemas/orderSchema");
const mongoose = require("mongoose");
const utils = require("./utils");
const Collections = require("../schemas/collectionSchema");

const detectOrderFullfilment = async (req, tagType) => {
  const session = req.body?.pageInfo?.currentPage;
  let parameters = req.body?.sessionInfo?.parameters;
  let response = [];
  const data = {
    orderId: parameters?.orderid || "N/A",
    phone: parameters?.customerphone || "N/A",
    postcode: parameters?.customerpostcode || "N/A",
    date: Date.now(),
  };
  const orderDetails = [
    Object.values(data).map((value) => JSON.stringify(value)),
  ];
  await accessGoogleSheet(orderDetails, "Sheet2");
  response.push(
    "Thank you for the information. Our order team will arrange to have the skip picked within next few days. Please ensure that the skip is level-loaded and safe for collection."
  );
  return utils.formatResponseForDialogflow(
    response,
    { session, parameters },
    "",
    ""
  );
};

module.exports = {
  detectOrderFullfilment,
};
