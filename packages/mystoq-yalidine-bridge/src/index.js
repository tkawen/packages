// Mystoq <-> Yalidine bridge
// https://mystoq.com

const YALIDINE_API = "https://api.yalidine.app/v1";

export class YalidineBridge {
  constructor({ apiId, apiToken }) {
    this.headers = {
      "X-API-ID": apiId,
      "X-API-TOKEN": apiToken,
      "Content-Type": "application/json",
    };
  }

  /**
   * Estimate shipping cost for an order from wilaya `from` to wilaya `to`.
   * Returns DZD price in cents.
   */
  async quote({ fromWilaya, toWilaya, weightKg = 1, stopDesk = false }) {
    const path = `/fees/?from_wilaya_id=${fromWilaya}&to_wilaya_id=${toWilaya}`;
    const res = await fetch(YALIDINE_API + path, { headers: this.headers });
    if (!res.ok) throw new Error("Yalidine quote failed: " + res.status);
    const data = await res.json();
    const fee = stopDesk ? data.express_desk : data.express_home;
    return Math.round(fee * 100); // -> cents of DZD
  }

  async createParcel({ order, productPrice }) {
    const body = [{
      order_id: order.id,
      from_wilaya_id: order.shipping.from_wilaya_id,
      firstname: order.customer.name.split(" ")[0],
      familyname: order.customer.name.split(" ").slice(1).join(" ") || "—",
      contact_phone: order.customer.phone,
      address: order.shipping.address || "—",
      to_commune_name: order.shipping.commune || "—",
      to_wilaya_name: order.shipping.wilaya,
      product_list: order.items.map(i => i.name).join(", "),
      price: productPrice,
      do_insurance: false,
      declared_value: productPrice,
      length: 10, width: 10, height: 10, weight: 1,
      freeshipping: false,
      is_stopdesk: !!order.shipping.stop_desk,
      has_exchange: false,
    }];
    const res = await fetch(YALIDINE_API + "/parcels/", {
      method: "POST", headers: this.headers, body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Yalidine createParcel failed: " + res.status);
    return res.json();
  }
}
