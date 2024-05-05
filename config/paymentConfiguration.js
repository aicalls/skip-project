require("dotenv").config();
const stripe = require("stripe")(process.env.SECRETE_KEY);

const createCustomerAndCharge = async (data) => {
  const { name, phone, email, token, amount } = data;

  try {
    let result = {};
    // Create a customer with the token
    const customer = await stripe.customers.create({
      name,
      phone,
      email,
      description: "Customer for test",
      source: token, // Use the token as the payment source
    });

    console.log("Created Customer: ", customer);

    // Charge the customer immediately
    const charge = await stripe.charges
      .create({
        amount: amount * 100, // Convert amount to cents
        currency: "USD",
        description: "Charge for product/service",
        customer: customer.id,
      })
      .then(() => {
        result = { success: true, redirect: "/success" };
      })
      .catch((err) => {
        result = { success: true, redirect: "/failure" };
      });
  } catch (error) {
    console.error("Error creating customer and charge: ", error.message);
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

const paymentIntentFunc = async ({ amount, currency }) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency ?? "USD",
    });
    return { success: true, clientSecret: paymentIntent.clientSecret };
  } catch (error) {
    return { success: true, message: error.message };
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

const createPaymentLink = async (amount) => {
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: amount || 0,
          quantity: 1,
        },
      ],
      mode: "payment"
    });
    return { success: true, url: session.url };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

module.exports = {
  createPaymentLink,
  createCustomerAndCharge,
  createPayment,
  createInvoiceAndPayment,
};
