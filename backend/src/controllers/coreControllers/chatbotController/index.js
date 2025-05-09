const { RequestSchema } = require('./validation');
const llm = require('./model');
const { StoreClientEntity, StoreTaxEntity, StorePaymentModeEntity, AddClient, AddTax, AddPaymentMode } = require('./functions');
const {HumanMessage } = require('@langchain/core/messages')

const chatbotController = async (req, res) => {
  const body = req.body;
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  const validateRequest = RequestSchema.safeParse(body);
  if (!validateRequest.success) {
    return res.status(400).json({
      success: false,
      result: null,
      message: validateRequest.error.errors[0]?.message,
    });
  }

  const toolsByName = {
    AddClient: AddClient,
    AddTax: AddTax,
    AddPaymentMode: AddPaymentMode
  };
  
  const messages = [new HumanMessage(body.message)];

  const AIResponse = await llm.invoke(messages);

  // * this for loop run `toolsByName` functions.
  // * if they are multiple functions, it calls them  
  for (const toolCall of AIResponse.tool_calls) {
    const toolFunction = toolsByName[toolCall.name];
    const toolMessage = await toolFunction.invoke(toolCall);
    messages.push(toolMessage);
    // if (toolFunction) {
    //   const args = toolCall.args;
    //   await toolFunction(args);
    // }
  }

  // * sessionId job here is to separate each user history chat
  return res.status(200).json({
    success: true,
    result: AIResponse,
    message: 'Ai response was sended successfully',
  });
};

module.exports = chatbotController;
