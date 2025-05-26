const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendSMS = async ({ to, message }) => {
  try {
    const result = await client.messages.create({
      body: message,
      to,
      from: process.env.TWILIO_PHONE_NUMBER
    });

    console.log('SMS sent:', result.sid);
    return result;
  } catch (error) {
    console.error('SMS sending failed:', error);
    throw error;
  }
};

module.exports = { sendSMS }; 