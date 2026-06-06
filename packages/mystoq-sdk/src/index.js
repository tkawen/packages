// Mystoq JavaScript SDK
// https://mystoq.com

const DEFAULT_BASE = "https://api.mystoq.com/v1";

export class MystoqClient {
  /**
   * @param {object} opts
   * @param {string} opts.apiKey  - your Mystoq API key (get one at mystoq.com/dashboard)
   * @param {string} [opts.tenant] - your tenant slug (e.g. "demo")
   * @param {string} [opts.baseUrl] - override the API base URL
   */
  constructor({ apiKey, tenant, baseUrl = DEFAULT_BASE }) {
    if (!apiKey) throw new Error("MystoqClient: apiKey is required");
    this.apiKey = apiKey;
    this.tenant = tenant;
    this.baseUrl = baseUrl.replace(/\/+$/, "");
  }

  async #req(path, init = {}) {
    const headers = {
      "Authorization": `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    };
    if (this.tenant) headers["X-Tenant-ID"] = this.tenant;
    const res = await fetch(`${this.baseUrl}${path}`, { ...init, headers });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Mystoq API ${res.status}: ${body.slice(0, 500)}`);
    }
    return res.json();
  }

  // Products
  listProducts(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.#req(`/products${qs ? "?" + qs : ""}`);
  }
  getProduct(id) { return this.#req(`/products/${encodeURIComponent(id)}`); }
  createProduct(data) {
    return this.#req("/products", { method: "POST", body: JSON.stringify(data) });
  }

  // Orders
  listOrders(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.#req(`/orders${qs ? "?" + qs : ""}`);
  }
  createOrder(data) {
    return this.#req("/orders", { method: "POST", body: JSON.stringify(data) });
  }

  // Wilayas (Algeria specific helper)
  listWilayas() { return this.#req("/wilayas"); }
}

export default MystoqClient;
