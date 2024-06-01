const express = require("express");
const router = express.Router();

const CONTROLLER = require("../controllers/export_controllers");

router.post("/collectionInquiry", async (req, res) => {
  let tag = req?.body?.fulfillmentInfo.tag;
  console.log("In Collection Webhook Requests..>!");
  console.log(tag);
  console.log("Find Parameter", req.body);
  try {
    if (tag === "collectOrder") {
      let responseData =
        await CONTROLLER.collectionQueryController.detectOrderFullfilment(req);
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
