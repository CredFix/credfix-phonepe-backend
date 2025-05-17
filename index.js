import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
app.use(express.json());

// ✅ Allow requests from your Wix domain
app.use(cors({
  origin: 'https://www.credfix.in',
  methods: ['POST'],
  allowedHeaders: ['Content-Type']
}));

// Replace with your actual PhonePe access token
const ACCESS_TOKEN = 'O-Bearer YOUR_ACCESS_TOKEN';  // Replace this
const REDIRECT_URL = 'https://www.credfix.in/thank-you';  // Redirect after payment

// 📦 Create Payment API
app.post('/create-payment', async (req, res) => {
  const { amount, orderId } = req.body;

  const payload = {
    merchantOrderId: orderId,
    amount: amount * 100, // convert to paise
    expireAfter: 1200,     // 20 minutes expiry
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
      'https://api.phonepe.com/apis/pg/checkout/v2/pay', // PROD URL
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

app.listen(3000, () => console.log('Server running on port 3000'));
