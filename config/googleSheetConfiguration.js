const { google } = require("googleapis");
const sheets = google.sheets("v4");
const credentials = require("./credentials.json");

async function accessGoogleSheet(data,sheetNo="Sheet1") {
  try {
    const client = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      ["https://www.googleapis.com/auth/spreadsheets"]
    );
    const auth = await client.authorize();
    // Specify the spreadsheet ID and range
    const spreadsheetId = process.env.SPREAD_SHEET_ID; // Replace with your actual spreadsheet ID
    const range = sheetNo; // Replace with the sheet name or range where you want to add data

    // Example data to add to the sheet

    // Add the new data to the sheet
    await sheets.spreadsheets.values
      .append({
        spreadsheetId,
        range,
        valueInputOption: "USER_ENTERED",
        resource: {
          values: data,
        },
        auth: client,
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));

    // Retrieve updated values from the sheet
    const sheetsResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
      auth: client,
    });

    const values = sheetsResponse.data.values;
    return { sheetsResponse, values, success: true };
  } catch (error) {
    return { errors: error, success: false };
  }
}

module.exports = { accessGoogleSheet };
