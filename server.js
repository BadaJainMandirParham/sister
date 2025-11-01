const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
// Use CORS for frontend-backend communication
app.use(cors());
app.use(express.json());

// Use environment variables for security
const EMAIL_USER = process.env.EMAIL_USER; // Your Gmail address for sending
const EMAIL_PASS = process.env.EMAIL_PASS; // App password (not your Gmail login password)
const EMAIL_TO   = process.env.EMAIL_TO;   // Your receiving email (can be same as user or another)

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  }
});

app.post('/send-mail', (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'No message provided.' });

  const mailOptions = {
    from: `"Sister Reply App" <${EMAIL_USER}>`,
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
app.listen(PORT, () => console.log('Email server running on port', PORT));
