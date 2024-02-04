const formatResponseForDialogflow = (
  texts,
  sessionInfo,
  targetFlow,
  targetPage,
  options = [],
  dataNotFound = false
) => {
  let messages = [];

  texts.forEach((text) => {
    messages.push({
      text: {
        text: [text],
        redactedText: [text],
      },
      responseType: "HANDLER_PROMPT",
      source: "VIRTUAL_AGENT",
    });
  });

  if (options.length > 0) {
    // Add rich content (chips) to the messages
    messages.push({
      payload: {
        richContent: [
          [
            {
              options: options,
              type: "chips",
            },
          ],
        ],
      },
    });
  }

  let responseData = {
    fulfillment_response: {
      messages: messages,
    },
  };

  if (sessionInfo !== "") {
    responseData["sessionInfo"] = sessionInfo;
  }

  if (targetFlow !== "") {
    responseData["targetFlow"] = targetFlow;
  }

  if (targetPage !== "") {
    responseData["targetPage"] = targetPage;
  }

  // Check if data is not found, and if so, don't include default input event
  if (dataNotFound) {
    responseData["fulfillment_response"]["messages"].push({
      event: {
        name: "sys.no-match-default", // Replace with your desired event
      },
    });
  }

  return responseData;
};

const getErrorMessage = () => {
  return formatResponseForDialogflow(
    ["We are facing a technical issue.", "Please try after sometimes...!"],
    "",
    "",
    "",
    [],
    true // Set dataNotFound to true for error message
  );
};

module.exports = {
  formatResponseForDialogflow,
  getErrorMessage,
};
