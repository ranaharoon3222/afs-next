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
  if (req.method !== 'GET') return res.status(200).json({ name: 'Hi AFS' });

  //   const bodyData = JSON.parse(req?.body);

  //   const customerReq = {
  //     customer: {
  //       first_name: bodyData.name,
  //       email: bodyData.email,
  //       verified_email: true,
  //       password: bodyData.pass,
  //       password_confirmation: bodyData.pass,
  //       send_email_welcome: false,
  //       metafields: [
  //         {
  //           key: 'dog_data',
  //           namespace: 'custom',
  //           value: JSON.stringify([bodyData.dogsData]),
  //           value_type: 'json_string',
  //         },
  //       ],
  //     },
  //   };

  const updateProduct = {
    product: {
      id: '8256097845481',
      variants: [
        {
          id: '46061296550121',
          price: '20',
        },
      ],
    },
  };

  const url = `https://all-fresh-seafood.myshopify.com/admin/api/2023-01/products/8256097845481.json`;
  try {
    const productResponse = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': process.env.TOKEN,
      },
      body: JSON.stringify(updateProduct),
    });

    res.status(200).json(await productResponse.json());
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
}
