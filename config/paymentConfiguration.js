require("dotenv").config();
const stripe = require("stripe")(process.env.SECRETE_KEY);

const createCustomer = async (data) => {
  const { name, phone, email, description = "" } = data;
  try {
    const customer = await stripe.customers.create({
      name,
      phone,
      email,
      description,
    });
    console.log("Final Customer: ", customer);
    return { success: true, customer };
  } catch (error) {
    console.error("Catcher Error: ", error.message);
    return { success: false, message: error.message };
  }
};

const createPayment = async (data) => {
  const {
    customer_id,
    card_Name,
    card_ExpYear,
    card_ExpMonth,
    card_Number,
    card_CVC,
  } = data;

  try {
    // Create a token using Elements or Stripe.js on the client side
    // and pass the token to the server to avoid handling raw card data
    // const card_token = await stripe.tokens.create({
    //   card: {
    //     name: card_Name,
    //     number: card_Number,
    //     exp_year: card_ExpYear,
    //     exp_month: card_ExpMonth,
    //     cvc: card_CVC,
    //   },
    // });
    // console.log("CardToken===>", card_token);
    // Attach the card to the customer
    const card = await stripe.customers.createSource(customer_id, {
      source: `tok_mastercard`,
    });

    return { card };
  } catch (error) {
    console.error("Catcher Error: ", error.message);
    return { success: false, message: error.message };
  }
};

const createInvoiceAndPayment = async (data) => {
  try {
    const customerDetails = await createCustomer(data);
    console.log("Custmer ID ===>", customerDetails?.customer?.id);
    if (customerDetails?.customer?.id) {
      const payment = await createPayment({
        customer_id: customerDetails.customer.id,
        card_Name: data.card_Name,
        card_ExpYear: data.card_ExpYear,
        card_ExpMonth: data.card_ExpMonth,
        card_Number: data.card_Number,
        card_CVC: data.card_CVC,
      });

      console.log("Payment Card ID ===>", payment.card.id);
      if (payment.success && payment.card.id) {
        const createCharge = await stripe.charges.create({
          receipt_email: "tester@gmail.com",
          amount: parseInt(data.amount) * 100, // Convert to cents
          currency: "USD",
          source: payment.card.id,
          customer: customerDetails.customer.id,
        });

        console.log("Payment: ", createCharge);
      }
    } else {
      console.error("Customer not found");
    }
  } catch (error) {
    console.error("CreateInvoice Payment Error: ", error.message);
  }
};

module.exports = {
  createCustomer,
  createPayment,
  createInvoiceAndPayment,
};
