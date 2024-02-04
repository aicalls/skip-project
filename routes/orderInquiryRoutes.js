const express = require("express");
const orderInquiryController = require("../controllers/orderInquiryController");
const router = express.Router();

const CONTROLLER = require("../controllers/export_controllers");
router.get('/payment', async (req, res) => {
  res.redirect("/buy")
});
router.get('/success', async (req, res) => {
  res.redirect("/success")
});
router.get('/failure', async (req, res) => {
  res.redirect("/failure")
});

router.post("/orderInquiry", async (req, res) => {
  let tag = req.body.fulfillmentInfo.tag;
  console.log("In Order Webhook Requests..>!");
  console.log(tag);
  console.log("Find Parameter", req.body);
  try {
    if (tag === "createOrder") {
      let responseData =
        await CONTROLLER.orderInquiryController.makeOrderInvoice(req);
      res.send(responseData);
    } else {
      res.send(
        CONTROLLER.utils.formatResponseForDialogflow([
          "This is from the webhook.",
          "There is no tag set for this request.",
        ])
      );
    }
  } catch (error) {
    console.log("Error", error);
    res.send(CONTROLLER.utils.getErrorMessage());
  }
});

module.exports = {
  router,
};
