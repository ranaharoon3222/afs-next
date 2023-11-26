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

  const cartValue = JSON?.parse(req?.body);

  try {
    const allVariantsUrl = `https://all-fresh-seafood.myshopify.com/admin/api/2023-01/products/8256097845481/variants.json`;

    const fetchAllVaraints = await fetch(allVariantsUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': process.env.TOKEN,
      },
    });

    const allVaraints = await fetchAllVaraints.json();

    const findVariant = allVaraints.variants.find((item) => {
      if (
        cartValue.value >= 0 &&
        cartValue.value <= 100 &&
        item.sku == 'SHIPINSURE001'
      ) {
        return item;
      } else if (
        cartValue.value >= 101 &&
        cartValue.value <= 200 &&
        item.sku == 'SHIPINSURE002'
      ) {
        return item;
      } else if (
        cartValue.value >= 201 &&
        cartValue.value <= 300 &&
        item.sku == 'SHIPINSURE003'
      ) {
        return item;
      } else if (
        cartValue.value >= 301 &&
        cartValue.value <= 499 &&
        item.sku == 'SHIPINSURE004'
      ) {
        return item;
      } else if (cartValue.value >= 500 && item.sku == 'SHIPINSURE005') {
        return item;
      }
    });

    res.status(200).json({ variant: findVariant, all: allVaraints.variants });
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
}
