const utils = require("./utils");

const availableSkips = (req) => {
  const session = req.body?.pageInfo?.currentPage;
  let parameters = req.body?.sessionInfo?.parameters;
  return utils.formatResponseForDialogflow(
    ["Welcome to skip order chatbot.", "Tell me about your appointment"],
    { session }, // replace with object and make own parameters
    "", // targetflow replace with url of flow
    "" // targetPage replace with url of page
  );
};

module.exports = {};
