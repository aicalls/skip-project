const { accessGoogleSheet } = require("../config/googleSheetConfiguration");
const {
  createCustomer,
  createInvoiceAndPayment,
  createCustomerAndCharge,
} = require("../config/paymentConfiguration");
const utils = require("./utils");

const makeOrderInvoice = async (req) => {
  const session = req.body?.pageInfo?.currentPage;
  let parameters = req.body?.sessionInfo?.parameters;
  parameters.name = parameters?.name?.name ?? "";
  const data = {
    name: parameters?.name??"",
    email: parameters?.email??"",
    address: parameters?.address??"",
    phone: parameters?.phone??"",
    instructions: parameters?.instructions??"",
    paytype: parameters?.paytype??"",
    skipsize: parameters?.skipsize??"",
    postcode: parameters?.postcode??"",
    availability: parameters?.availability??"",
    price: parameters?.price??0,
    wasteitem: parameters?.wasteitem??"",
    wastequantity: parameters?.wastequantity??"",
    weekcount: parameters?.weekcount
      ? `${parameters?.weekcount} weeks extended`
      : "only 1 week",
    permitprice: parameters?.permitprice
      ? `permit required`
      : "permit not required",
  };
  const orderDetails = [
    Object.values(data).map((value) => JSON.stringify(value)),
  ];
  await accessGoogleSheet(orderDetails);
  // const customer = await createCustomerAndCharge({
  //   name: parameters?.name?.name,
  //   email: parameters?.email,
  //   phone: parameters?.phone,
  //   amount: 200,
  //   description: "",
  //   cardNumber: parameters?.cardnumber,
  //   expMonth: parameters?.expmonth,
  //   expYear: parameters?.expyear,
  //   cvc: parameters?.cvc,
  // });

  return utils.formatResponseForDialogflow(
    [``],
    { session, parameters },
    "",
    ""
  );
};

module.exports = {
  makeOrderInvoice,
};
