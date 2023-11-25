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
        item.price == 5.15
      ) {
        console.log('1');
        return item;
      } else if (
        cartValue.value >= 101 &&
        cartValue.value <= 200 &&
        item.price == 5.99
      ) {
        console.log('2');
        return item;
      } else if (
        cartValue.value >= 201 &&
        cartValue.value <= 400 &&
        item.price == 8.99
      ) {
        console.log('3');
        return item;
      } else if (
        (cartValue.value / 100) * 3 <= item.price &&
        cartValue.value >= 401
      ) {
        console.log('4', cartValue.value);
        return item;
      }
    });

    res.status(200).json({ variant: findVariant, all: allVaraints.variants });
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
}
