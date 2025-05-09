import { API_BASE_URL } from '@/config/serverApiConfig';
import errorHandler from '@/request/errorHandler';
import successHandler from '@/request/successHandler';
import axios from 'axios';
import { storePersist } from '@/redux/storePersist';

axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const auth = storePersist.get('auth');

if (auth) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${auth.current.token}`;
}

async function ChatbotEndpoint(jsonData) {
  try {
    const response = await axios.post('/chatbot', jsonData);

    if (response.data?.result?.kwargs?.content == '') {
      successHandler(response, {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      });
      return {
        functionCalled: true,
      };
    }
    successHandler(response, {
      notifyOnSuccess: false,
      notifyOnFailed: true,
    });
    return response.data.result.kwargs.content;

  } catch (error) {
    return errorHandler(error);
  }
}

export default ChatbotEndpoint