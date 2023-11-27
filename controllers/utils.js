const formatResponseForDialogflow = (
    texts,
    sessionInfo,
    targetFlow,
    targetPage,
    options = []
  ) => {
    messages = [];
  
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
  
    return responseData;
  };
  
  const getErrorMessage = () => {
    return formatResponseForDialogflow(
      ["We are facing a technical issue.", "Please try after sometimes...!"],
      "",
      "",
      ""
    );
  };
  
  module.exports = {
    formatResponseForDialogflow,
    getErrorMessage,
  };
  