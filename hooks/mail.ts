/* eslint-disable prettier/prettier */

export const sendEmailNotification = async (email: string) => {
  try {
    const response = await fetch(
      'https://7148-203-215-167-36.ngrok-free.app/send-email',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email: email}),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    const result = await response.json();
    console.log('Email sent:', result);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
