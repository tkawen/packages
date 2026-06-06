#!/usr/bin/env node
// Minimal MCP server for Mystoq.
// Lets Claude / other LLM agents read products, orders, wilayas
// from a merchant's Mystoq store via the Model Context Protocol.
// https://mystoq.com

const API_BASE = process.env.MYSTOQ_API_BASE || "https://api.mystoq.com/v1";
const API_KEY  = process.env.MYSTOQ_API_KEY;
const TENANT   = process.env.MYSTOQ_TENANT;

if (!API_KEY) {
  console.error("MYSTOQ_API_KEY env var is required");
  process.exit(1);
}

async function call(method, path, body) {
  const headers = {
    "Authorization": `Bearer ${API_KEY}`,
    "Accept": "application/json",
    "Content-Type": "application/json",
  };
  if (TENANT) headers["X-Tenant-ID"] = TENANT;
  const res = await fetch(API_BASE + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  if (!res.ok) throw new Error(`Mystoq API ${res.status}`);
  return res.json();
}

// MCP tools surfaced to agents
const tools = [
  { name: "list_products", description: "List products in the connected Mystoq store.",
    inputSchema: { type: "object", properties: { limit: { type: "integer" } } } },
  { name: "list_orders", description: "List recent orders.",
    inputSchema: { type: "object", properties: { status: { type: "string" } } } },
  { name: "list_wilayas", description: "List all Algerian wilayas.",
    inputSchema: { type: "object", properties: {} } },
];

async function handleRpc(req) {
  if (req.method === "initialize") {
    return { protocolVersion: "2024-11-05", serverInfo: { name: "mystoq-mcp", version: "0.1.0" },
             capabilities: { tools: {} } };
  }
  if (req.method === "tools/list") return { tools };
  if (req.method === "tools/call") {
    const { name, arguments: args = {} } = req.params || {};
    let data;
    if (name === "list_products") data = await call("GET", "/products?limit=" + (args.limit || 20));
    else if (name === "list_orders") data = await call("GET", "/orders" + (args.status ? "?status=" + args.status : ""));
    else if (name === "list_wilayas") data = await call("GET", "/wilayas");
    else throw new Error("Unknown tool: " + name);
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
  throw new Error("Unsupported method: " + req.method);
}

// JSON-RPC over stdio
let buf = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", async (chunk) => {
  buf += chunk;
  let nl;
  while ((nl = buf.indexOf("\n")) >= 0) {
    const line = buf.slice(0, nl).trim();
    buf = buf.slice(nl + 1);
    if (!line) continue;
    try {
      const req = JSON.parse(line);
      const result = await handleRpc(req);
      process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id: req.id, result }) + "\n");
    } catch (e) {
      process.stdout.write(JSON.stringify({ jsonrpc: "2.0", error: { code: -32000, message: String(e) } }) + "\n");
    }
  }
});
