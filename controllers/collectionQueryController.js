require("dotenv").config();
const { accessGoogleSheet } = require("../config/googleSheetConfiguration");
const Orders = require("../schemas/orderSchema");
const mongoose = require("mongoose");
const utils = require("./utils");
const Collections = require("../schemas/collectionSchema");
const { sendEmail } = require("../config/mailer");

const detectOrderFullfilment = async (req, tagType) => {
  const session = req.body?.pageInfo?.currentPage;
  let parameters = req.body?.sessionInfo?.parameters;
  let response = [];
  const data = {
    orderId: parameters?.orderid || "N/A",
    phone: parameters?.customerphone || "N/A",
    postcode: parameters?.customerpostcode || "N/A",
    email: parameters?.email || "N/A",
    date: Date.now(),
  };
  const orderDetails = [
    Object.values(data).map((value) => JSON.stringify(value)),
  ];
  await accessGoogleSheet(orderDetails, "Sheet2");
  if (process?.env?.EMAIL_USER && process?.env?.EMAIL_PASS && parameters?.email) {
    await sendEmail(
      parameters?.email,
      "EFR Collection Comfirmation Email",
      `Thank you for the information. Our order team will arrange to have the skip picked within next few days. Please ensure that the skip is level-loaded and safe for collection.
    `
    );
  }
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
