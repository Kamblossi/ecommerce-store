import type { NextApiRequest, NextApiResponse } from 'next';
import PesaPal, { init } from './pesapal/index';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any | { error: string }>
) {
  if (req.method === 'POST') {
    try {
      const pPal = init({
        key: `${process.env.PESAPAL_CONSUMER_KEY}`,
        secret: `${process.env.PESAPAL_CONSUMER_SECRET}`,
        debug: true, // false in production!
      });

      console.log("Cool Beans");

      // Ensure authenticate is awaited correctly
      const authResponse = await PesaPal.authenticate();
      console.log('Authenticated:', JSON.stringify(authResponse, null, 2));

      const options = {
        url: "https://some.com/home", // TODO: The POST URL on the backend to receive the payment notification from PesaPal to update the order status
        ipn_notification_type: "POST"
      };

      try {
        const ipnResult = await PesaPal.register_ipn_url(options);
        console.log(ipnResult);

        const response = await PesaPal.submit_order({ ...req.body, notification_id: ipnResult.ipn_id });
        console.log('Order submitted successfully:', JSON.stringify(response, null, 2));
        res.status(200).json(response);
      } catch (error) {
        console.error('Error registering IPN URL:', JSON.stringify(error, null, 2));
      }



    } catch (error) {
      console.error('Error submitting order:', JSON.stringify(error, null, 2));
      res.status(500).json({ error: 'Failed to submit order' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}