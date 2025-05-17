import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const ACCESS_TOKEN = 'O-Bearer YOUR_ACCESS_TOKEN'; // 👈 Replace this with actual token
const REDIRECT_URL = 'https://www.credfix.in/thank-you'; // 👈 Update if needed

app.post('/create-payment', async (req, res) => {
  const { amount, orderId } = req.body;

  const payload = {
    merchantOrderId: orderId,
    amount: amount * 100,
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
      'https://api.phonepe.com/apis/pg/checkout/v2/pay',
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
    console.error(err.response?.data || err);
    res.status(500).send('Payment initiation failed');
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
