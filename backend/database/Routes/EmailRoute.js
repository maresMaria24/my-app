const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = express.Router();

router.use(cors());
router.use(bodyParser.json());

router.post('/confirmare', async (req, res) => {
  const { email, name } = req.body;
    console.log("ACI");
  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other email services
    auth: {
      user: 'brainitonline@gmail.com', // Your email
      pass: 'uzxx jhpy afir febm', // Your email password
    },
  });

  // Email options
  const mailOptions = {
    from: 'brainitonline@gmail.com',
    to: email,
    subject: 'Email Confirmation',
    text: `Hello ${name},\n\nThank you for signing up! Please confirm your email address by clicking the link below:\n\nhttp://your-website.com/confirm-email?token=someTokenHere\n\nBest regards,\nYour Company Name`,
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).send('Confirmation email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending confirmation email');
  }
});

module.exports = router;
