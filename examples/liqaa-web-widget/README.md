# LIQAA — web video widget

A single static HTML page that adds an instant **video-call** button to any site using
[`@tkawen/liqaa-js`](https://www.npmjs.com/package/@tkawen/liqaa-js).

## Run

Serve the folder with any static server, e.g.:

```bash
npx serve .
```

Then open the page and click **Start video call**.

## Before it works

- Replace `pk_live_xxx` with your LIQAA **public key**.
- Replace `REPLACE_WITH_SERVER_TOKEN` with a short-lived **SDK token** minted by your
  backend: `POST https://liqaa.io/api/public/v1/sdk-token`. Never hard-code it in production.

## What you learn

- `await LIQAA.init({ publicKey, sdkToken, accent })`
- `liqaa.startCall(email, name)` and event handling via `liqaa.on("call.started", ...)`

Full reference: [docs.tkawen.com](https://docs.tkawen.com/packages/liqaa-js/).
