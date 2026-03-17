require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:4173'], // Vite dev & preview
    methods: ['POST'],
}));

// Create reusable transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

// Verify transporter on startup
transporter.verify()
    .then(() => console.log('✅ Gmail SMTP connection verified'))
    .catch((err) => console.error('❌ Gmail SMTP connection failed:', err.message));

// POST /api/contact
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields (name, email, message) are required.' });
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    try {
        await transporter.sendMail({
            from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
            to: process.env.CONTACT_RECEIVER,
            replyTo: email,
            subject: `Portfolio Contact: ${name}`,
            text: [
                `New message from your portfolio contact form:`,
                ``,
                `Name: ${name}`,
                `Email: ${email}`,
                ``,
                `Message:`,
                message,
            ].join('\n'),
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00ffcc; border-bottom: 2px solid #00ffcc; padding-bottom: 10px;">
            New Portfolio Contact
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 8px; font-weight: bold; color: #555;">Name:</td>
              <td style="padding: 8px;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; color: #555;">Email:</td>
              <td style="padding: 8px;"><a href="mailto:${email}">${email}</a></td>
            </tr>
          </table>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin-top: 10px;">
            <h3 style="margin: 0 0 10px; color: #333;">Message:</h3>
            <p style="margin: 0; white-space: pre-wrap; color: #444;">${message}</p>
          </div>
        </div>
      `,
        });

        res.json({ success: true, message: 'Email sent successfully!' });
    } catch (err) {
        console.error('Failed to send email:', err.message);
        res.status(500).json({ error: 'Failed to send email. Please try again later.' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`🚀 Portfolio server running on http://localhost:${PORT}`);
});
