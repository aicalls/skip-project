// import Files, Libraries and Modules
const express = require("express");
const priceInquiryRoutes = require("../routes/priceInquiryRoutes");
const orderInquiryRoutes = require("../routes/orderInquiryRoutes");
const collectionInquiryRoutes = require("../routes/collectionInquiryRoutes");
const cookieParser = require("cookie-parser");
const actuator = require("express-actuator");
const compression = require("compression");
const helmet = require("helmet");
const path = require('path');
const connectToDb = require("../config/db_config");
const morgan = require("morgan");
const cacheController = require("express-cache-controller");
const { errorHandler } = require("../utils/customErrorHandler");
const { debug } = require("console");
const cors = require("cors");
const { sendEmail } = require("../config/mailer");

// Call required middle
const app = express();

app.set('view engine', 'ejs');
console.log(__dirname, './views');
app.set('views', path.join(__dirname, './views'));
connectToDb();

app.use(
  cors({
    origin: "*",
    methods: "*",
    allowedHeaders: "*",
  })
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());
app.use(helmet());
app.use(actuator());
app.use(compression());
app.disable("x-powered-by");
app.use(cacheController());
app.use(express.urlencoded({ extended: true }));

// Cookies middleware calls
app.use(morgan("combined"));
app.use(cookieParser());

// Call proxy secured session.
app.set("trust proxy", 1); // trust first proxy

// Custom error handler
app.use(errorHandler);
// Call process which is take look of uncaught exception.
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

// Call Port of the server
const port = process.env.PORT ?? 5000;

app.use(priceInquiryRoutes.router);
app.use(orderInquiryRoutes.router);
app.use(collectionInquiryRoutes.router);

app.post('/send-email', async (req, res) => {
  const { to, subject, text } = req.body;

  try {
    const response = await sendEmail(to, subject, text);
    res.status(200).send('Email sent: ' + response);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});
// default route
app.use((req, res, next) => {
  res
    .status(404)
    .json({ message: "Sorry, this route doesn't exist.", success: false });
});

// Call Backend Server listening which port is using.
const server = app.listen(port, () => {
  console.log(`Skip ordering chatbot listening at http://localhost:${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  debug("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    debug("HTTP server closed");
  });
});
