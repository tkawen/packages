// Mystoq — Node.js quickstart
// Build a cash-on-delivery (COD) flow for an Algerian store in ~20 lines.
//
//   npm install
//   MYSTOQ_API_KEY=sk_live_xxx MYSTOQ_TENANT=demo npm start
//
// Get an API key at https://mystoq.com/dashboard

import { MystoqClient } from "@tkawen/mystoq-sdk";

const mystoq = new MystoqClient({
  apiKey: process.env.MYSTOQ_API_KEY,
  tenant: process.env.MYSTOQ_TENANT || "demo",
});

// 1) Algerian delivery zones (the 58 wilayas)
const wilayas = await mystoq.listWilayas();
console.log(`✓ ${wilayas.length ?? "?"} wilayas available for delivery`);

// 2) The store's products
const products = await mystoq.listProducts({ limit: 5 });
console.log(`✓ ${products.length ?? products.data?.length ?? "?"} products`);

// 3) Place a cash-on-delivery order
const order = await mystoq.createOrder({
  customer: { name: "Yacine B.", phone: "0550000000", wilaya: "Alger" },
  items: [{ product_id: "demo-tshirt", quantity: 2 }],
  payment: "cod",      // cash on delivery — the dominant method in Algeria
  delivery: "home",    // "home" or "stopdesk"
});
console.log("✓ Order created:", order.id ?? order);
