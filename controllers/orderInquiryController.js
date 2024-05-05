const { accessGoogleSheet } = require("../config/googleSheetConfiguration");
const {
  createCustomer,
  createInvoiceAndPayment,
  createCustomerAndCharge,
  createPaymentLink,
} = require("../config/paymentConfiguration");
const utils = require("./utils");

const makeOrderInvoice = async (req) => {
  const session = req.body?.pageInfo?.currentPage;
  let parameters = req.body?.sessionInfo?.parameters;
  parameters.name = parameters?.name?.name ?? "";
  let paymentType = parameters?.paytype;
  const data = {
    name: parameters?.name ?? "",
    email: parameters?.email ?? "",
    address: parameters?.address ?? "",
    phone: parameters?.phone ?? "",
    instructions: parameters?.instructions ?? "",
    paytype: parameters?.paytype ?? "",
    skipsize: parameters?.skipsize ?? "",
    postcode: parameters?.postcode ?? "",
    availability: parameters?.availability ?? "",
    price: parameters?.price ?? 0,
    wasteitem: parameters?.wasteitem ?? "",
    wastequantity: parameters?.wastequantity ?? "",
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

  let response = [];
  parameters?.paytype === "Cash on Delivery"
    ? [
        "Thank you for choosing us. We'll confirm your order via email and SMS. Please review our terms and conditions. For any queries, reach us at 01924 637777 during office hours.",
      ]
    : [
        `Thank you for choosing us. During office hours, a team member will contact you on your mobile to process a card transaction. Outside office hours, you will receive a call once the office reopens. Our trading hours are 8am to 5pm from Monday to Saturday; we are closed on Sundays.`,
      ];
  if (paymentType.toLowerCase() === "cash on delivery") {
    const paymentLink = await createPaymentLink(parameters?.price);
    if (paymentLink.status) {
      response = [
        paymentLink.url || "",
        "Thank you for choosing us. We'll confirm your order via email and SMS. Please review our terms and conditions. For any queries, reach us at 01924 637777 during office hours.",
      ];
    } else {
      response.push(
        "Unable to make payment link. There is something wrong with server. Please try again!"
      );
    }
  } else {
    response.push(
      `Thank you for choosing us. During office hours, a team member will contact you on your mobile to process a card transaction. Outside office hours, you will receive a call once the office reopens. Our trading hours are 8am to 5pm from Monday to Saturday; we are closed on Sundays.`
    );
  }
  return utils.formatResponseForDialogflow(
    [response],
    { session, parameters },
    "",
    ""
  );
};

module.exports = {
  makeOrderInvoice,
};
