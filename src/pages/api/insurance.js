// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import Cors from 'cors';

const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
};

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);
  if (req.method !== 'POST') return res.status(200).json({ name: 'Hi AFS' });

  // const updateProduct = JSON.parse(req?.body);

  // const url = `https://all-fresh-seafood.myshopify.com/admin/api/2023-01/products/8256097845481.json`;
  try {
    // const productResponse = await fetch(url, {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'X-Shopify-Access-Token': process.env.TOKEN,
    //   },
    //   body: JSON.stringify(updateProduct),
    // });

    const draftUrl = `https://all-fresh-seafood.myshopify.com/admin/api/2023-01/draft_orders.json`;

    const draftOrder = await fetch(draftUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': process.env.TOKEN,
      },
      body: JSON.stringify({
        draft_order: {
          line_items: [
            { title: 'Custom product', price: '20.00', quantity: 1 },
          ],
        },
      }),
    });

    const orderRes = await draftOrder.json();

    res.status(200).json(orderRes);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
}
