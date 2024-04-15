/* eslint-disable prettier/prettier */
import axios from 'axios';

interface INotification {
  token: string;
  title: string;
  body: string;
  navigationId: string; // Assuming there's a navigationId field based on your Express code
}
//https://whippy-bois-server.onrender.com/
export const sendNotification = async (options: INotification) => {
  try {
    const {token, title, body, navigationId} = options;
    const data = {
      token,
      title,
      body,
      navigationId,
    };
    const response = await axios.post(
      'https://whippy-bois-server.onrender.com/send-notification',
      data,
    );
    console.log('Notification sent successfully:', response.data);
  } catch (error: any) {
    console.error('Failed to send notification:', error.message);
  }
};

export const fetchData = async () => {
  try {
    const response = await fetch('https://whippy-bois-server.onrender.com/');
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    const data = await response.text(); // Adjust based on the response type
    console.log('Data received:', data);
    return data;
  } catch (error) {
    console.error('Error fetching data: GET ENDPOINT', error);
    console.log('Detailed error: ', error);
    return null;
  }
};
