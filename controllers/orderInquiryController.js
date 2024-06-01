const { accessGoogleSheet } = require("../config/googleSheetConfiguration");
// const {
//   createCustomer,
//   createInvoiceAndPayment,
//   createCustomerAndCharge,
//   createPaymentLink,
// } = require("../config/paymentConfiguration");
const Orders = require("../schemas/orderSchema");
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
  
  try {
    await Orders.create(parameters);

    let response = [];
    const paymentType = parameters?.paytype; 
    
    if (paymentType === "Cash on Delivery") {
      response = [
        "Thank you for choosing us. We'll confirm your order via email and SMS. Please review our terms and conditions. For any queries, reach us at 01924 637777 during office hours.",
      ];
    } else {
      response = [
        `Thank you for choosing us. During office hours, a team member will contact you on your mobile to process a card transaction. Outside office hours, you will receive a call once the office reopens. Our trading hours are 8am to 5pm from Monday to Saturday; we are closed on Sundays.`,
      ];
    }
    
    return utils.formatResponseForDialogflow(
      response,
      { session, parameters },
      "",
      "" 
    );
  } catch (error) {
    console.log(error.message)
    return utils.getErrorMessage();
  }
};

module.exports = {
  makeOrderInvoice,
};
