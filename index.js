import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
app.use(express.json());

// ✅ Allow CORS from Wix domain and handle preflight
app.use(cors({
  origin: 'https://www.credfix.in',
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type']
}));

// ✅ Replace with your actual PhonePe token and URL
const ACCESS_TOKEN = 'O-Bearer YOUR_ACCESS_TOKEN';  // Replace this
const REDIRECT_URL = 'https://www.credfix.in/thank-you';  // Replace if needed

// 📦 PhonePe Payment Endpoint
app.post('/create-payment', async (req, res) => {
  const { amount, orderId } = req.body;

  const payload = {
    merchantOrderId: orderId,
    amount: amount * 100, // convert ₹ to paise
    expireAfter: 1200,
    paymentFlow: {
      type: "PG_CHECKOUT",
      message: "Thank you for applying at CredFix",
      merchantUrls: {
        redirectUrl: REDIRECT_URL
      }
    }
  };

  try {
    const response = await axios.post(
      'https://api.phonepe.com/apis/pg/checkout/v2/pay', // PROD endpoint
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': ACCESS_TOKEN
        }
      }
    );

    const redirectUrl = response.data.redirectUrl;
    res.send({ redirectUrl });
  } catch (err) {
    console.error('PhonePe error:', err.response?.data || err.message);
    res.status(500).send('Payment initiation failed');
  }
});

// Start server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
