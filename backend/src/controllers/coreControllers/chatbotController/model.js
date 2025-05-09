const { ChatOpenAI } = require('@langchain/openai');
const { ChatPromptTemplate, MessagesPlaceholder } = require('@langchain/core/prompts');
const { ChatMessageHistory } = require('@langchain/community/stores/message/in_memory');
const { RunnableWithMessageHistory } = require('@langchain/core/runnables');
const {createToolCallingAgent } = require('langchain/agents')
const { AddClient, AddTax, AddPaymentMode } = require('./functions');

/** 
 * ! THIS MODEL WILL REMEMBER THE CHAT HISTORY
*/


const llm = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4o',
  temperature: 0.4
}).bindTools([AddClient, AddTax, AddPaymentMode])



// const contextualizeQSystemPrompt =
// "you are a helpful crm chatbot agent. help the user to add client, tax, payment mode. " +
// "never give any empty arguments to functions instead guide user to fill all of them " +
// "if they wanted to add any entity, give make them a text form to fill. " +
// "use stunning markup and try to list everything and use emoji"

// const prompt = ChatPromptTemplate.fromMessages([
//   ["system", contextualizeQSystemPrompt],
//   new MessagesPlaceholder('chat_history'),
// ]);

// const messageHistory = new ChatMessageHistory();

// const chain = prompt.pipe(llm);

// const model = new RunnableWithMessageHistory({
//   runnable: chain,
//   getMessageHistory: (_sessionId) => messageHistory,
//   inputMessagesKey: 'input',
//   historyMessagesKey: 'chat_history',
// });


module.exports = llm