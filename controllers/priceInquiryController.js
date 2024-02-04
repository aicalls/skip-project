const { wasteModel } = require("../schemas/wasteSchema");
const ZoneModel = require("../schemas/zonesSchema");
const utils = require("./utils");

const costInquiry = async (req) => {
  const session = req.body?.pageInfo?.currentPage;
  let parameters = req.body?.sessionInfo?.parameters;
  console.log(parameters);
  const zonesFind = await ZoneModel.findOne({
    postCodes: parameters.postcode,
    "prices.skipType": parameters.skipsize,
  });
  if (zonesFind) {
    let prices = zonesFind.prices.filter(
      (res) => res.skipType === parameters.skipsize
    );
    parameters = { ...parameters, price: prices[0].price ?? 0 };
    return utils.formatResponseForDialogflow(
      [
        `The ${parameters.skipsize ?? "skip"} will cost £${
          prices[0].price ?? 0
        } pounds, but there may be additional charges for controlled waste items.
    `,
      ],
      { session, parameters },
      "",
      ""
    );
  } else {
    return utils.formatResponseForDialogflow(
      ["Unable to find your required destination price for your skip"],
      { session },
      "",
      ""
    );
  }
};
const calculateWasteDetails = async (req) => {
  const session = req.body?.pageInfo?.currentPage;
  let parameters = req.body?.sessionInfo?.parameters;
  let price = parameters?.price ?? 0;
  console.log("Parameters===>", parameters);
  const wasteFind = await wasteModel.find({
    name: { $in: parameters.wasteitem.map((res) => res) },
  });
  if (wasteFind && wasteFind?.length > 0) {
    let response = [];
    let totalWastePrice = 0;
    wasteFind.forEach((res, index) => {
      totalWastePrice += parseInt(
        res.price * (parameters?.wastequantity[index] ?? 1)
      );
      response.push(
        `${parameters?.wastequantity[index]} ${res.name} price is ${
          res.price * (parameters?.wastequantity[index] ?? 1)
        }`
      );
    });
    parameters = { ...parameters, price: price + totalWastePrice };
    response.push(`your total waste price is ${price + totalWastePrice}`);
    return utils.formatResponseForDialogflow(
      response,
      { session, parameters },
      "",
      ""
    );
  } else {
    parameters = { ...parameters, wasteitem: null };
    return utils.formatResponseForDialogflow(
      [
        "Sorry, unfortunately we couldn't find your waste item, please try again",
      ],
      { session },
      "",
      ""
    );
  }
};
const controlledWaste = (req) => {
  const session = req.body?.pageInfo?.currentPage;
  let parameters = req.body?.sessionInfo?.parameters;
  console.log(parameters);
  return utils.formatResponseForDialogflow(
    [
      "Controlled waste items are those that require special handling or disposal due to their environmental impact. This includes items such as plasterboard, carpets, mattresses, and tires. Here are the prices for the items:",
      "Single Mattress - £10.00 per unit",
      "Double Mattress - £15.00 per unit",
      "Carpet/ Underlay - £10.00 per room",
      "Car Tyre - £10.00 per unit",
      "Large Appliances/Electronic Equipment (excluding fridges) - £10.00 Price per item",
      "Plasterboard – depends on how much",
      "Carpet Tiles - £5.00 Per Unit",
      "Fridge Freezer  - £30.00 Per Unit",
      "Pop Waste (Sofas, Foam, Chairs etc) - £250.00",
    ],
    { session },
    "",
    ""
  );
};

module.exports = {
  controlledWaste,
  costInquiry,
  calculateWasteDetails
};
