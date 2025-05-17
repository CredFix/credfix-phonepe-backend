import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
app.use(express.json());

// ✅ Handle CORS manually (including preflight)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://www.credfix.in");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

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

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
