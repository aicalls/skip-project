const express = require("express");
const router = express.Router();

const CONTROLLER = require("../controllers/export_controllers");

router.post("/priceInquiry", async (req, res) => {
  let tag = req?.body?.fulfillmentInfo?.tag;
  console.log("A new request came...");
  console.log(tag);
  console.log("Find Parameter", req?.body);
  try {
    if (tag === "controlledWaste") {
      let responseData =
        await CONTROLLER.priceInquiryController.controlledWaste(req);
      res.send(responseData);
    } else if (tag === "calculateWasteDetails") {
      let responseData =
        await CONTROLLER.priceInquiryController.calculateWasteDetails(req);
      res.send(responseData);
    } else if (tag === "costInquiry") {
      let responseData = await CONTROLLER.priceInquiryController.costInquiry(
        req
      );
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
