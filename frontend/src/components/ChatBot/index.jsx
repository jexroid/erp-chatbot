import useFetch from '@/hooks/useFetch';
import { Widget, addResponseMessage } from 'react-chat-widget';

import 'react-chat-widget/lib/styles.css';
import ChatbotEndpoint from './api';
import { useState } from 'react';

export default function ChatBot() {

  const handleUserMessage = async (userMessage) => {
    try {
      const response = await ChatbotEndpoint({ message: userMessage });
      if (response.functionCalled) {
        addResponseMessage('✅ request is accomplished');
      } else {
        addResponseMessage(`${response}`);
      }
    } catch (error) {
      console.error('Error in chatbot:', error);
      addResponseMessage("Sorry, I encountered an error. Please try again.");
    }
  };

  return <Widget handleNewUserMessage={handleUserMessage} />;
}
