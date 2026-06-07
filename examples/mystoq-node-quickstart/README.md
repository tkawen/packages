# Mystoq — Node.js quickstart

A minimal example that uses [`@tkawen/mystoq-sdk`](https://www.npmjs.com/package/@tkawen/mystoq-sdk) to:

1. list Algeria's 58 delivery wilayas,
2. list the store's products,
3. create a **cash-on-delivery** order.

## Run

```bash
npm install
MYSTOQ_API_KEY=sk_live_xxx MYSTOQ_TENANT=demo npm start
```

Get an API key from the [Mystoq dashboard](https://mystoq.com/dashboard).

## What you learn

- Authenticating with `new MystoqClient({ apiKey, tenant })`
- The COD order shape: `customer`, `items`, `payment: "cod"`, `delivery: "home" | "stopdesk"`

See the full reference at [docs.tkawen.com](https://docs.tkawen.com/packages/mystoq-sdk/).
