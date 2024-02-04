const { accessGoogleSheet } = require("../config/googleSheetConfiguration");
const {
  createCustomer,
  createInvoiceAndPayment,
} = require("../config/paymentConfiguration");
const utils = require("./utils");

const makeOrderInvoice = async (req) => {
  const session = req.body?.pageInfo?.currentPage;
  let parameters = req.body?.sessionInfo?.parameters;
  // parameters.name = parameters?.name?.name ?? "";
  const orderDetails = [
    Object.values(parameters).map((value) => JSON.stringify(value)),
  ];
  await accessGoogleSheet(orderDetails);
  const customer = await createInvoiceAndPayment({
    name: parameters?.name?.name,
    email: parameters?.email,
    phone: parameters?.phone,
    amount: "200",
  });
  console.log("Customer", customer);
  return utils.formatResponseForDialogflow(
    [`Your Order has been submitted successfully!`],
    { session, parameters },
    "",
    ""
  );
};

module.exports = {
  makeOrderInvoice,
};
