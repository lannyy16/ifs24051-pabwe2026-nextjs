/* c8 ignore file */

import { createServer } from "http";
import next from "next";

const port = Number(process.env.PORT || process.env.APP_PORT || 3000);
const hostname = process.env.APP_HOST || "0.0.0.0";

const app = next({
  dev: process.env.NODE_ENV !== "production",
  hostname,
  port,
});

const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res);
  }).listen(port, hostname, () => {
    console.log(`> Next.js ready: http://${hostname}:${port}`);
  });
});