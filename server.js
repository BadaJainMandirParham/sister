const express = require('express');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
app.use(cors());
app.use(express.json());

const accountSid = process.env.TWILIO_ACCOUNT_SID || 'ACeacf87f285e532aea94d6b028462683f';
const authToken = process.env.TWILIO_AUTH_TOKEN || 'YOUR_ACTUAL_TWILIO_AUTH_TOKEN'; // <-- Fill on Render env var!
const client = twilio(accountSid, authToken);

const toWhatsApp = 'whatsapp:+916399003541'; // Your WhatsApp number
const fromWhatsApp = 'whatsapp:+14155238886'; // Twilio sandbox WhatsApp

app.post('/send-wa', (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'No message provided.' });

  client.messages
    .create({
      body: `Sister's Reply: ${message}`,
      from: fromWhatsApp,
      to: toWhatsApp
    })
    .then(msg => res.json({ success: true, sid: msg.sid }))
    .catch(err => res.status(500).json({ error: err.message }));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log('WhatsApp SMS server running on port', PORT));
