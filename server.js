const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// Use environment variables for SendGrid
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM;
const EMAIL_TO = process.env.EMAIL_TO;

const transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: 'apikey', // literally "apikey"
    pass: SENDGRID_API_KEY
  }
});

app.post('/send-mail', (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'No message provided.' });

  const mailOptions = {
    from: `"Sister Reply App" <${EMAIL_FROM}>`,
    to: EMAIL_TO,
    subject: "Sister's Reply!",
    text: `Sister's Reply:\n${message}`,
    html: `<h2>Sister's Reply</h2><p>${message}</p>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Email send failed:', error.message);
      return res.status(500).json({ error: error.message });
    }
    res.json({ success: true, info });
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log('SendGrid Email server running on port', PORT));
