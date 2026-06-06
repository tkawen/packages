// Mystoq <-> Maystro Delivery bridge
// https://mystoq.com

const MAYSTRO_API = "https://backend.maystro-delivery.com/api";

export class MaystroBridge {
  constructor({ apiToken }) {
    this.headers = {
      "Authorization": "Token " + apiToken,
      "Content-Type": "application/json",
    };
  }

  async createOrder({ order, productPrice }) {
    const payload = {
      external_order_id: order.id,
      customer_name: order.customer.name,
      customer_phone: order.customer.phone,
      destination_wilaya: order.shipping.wilaya,
      destination_commune: order.shipping.commune || "",
      product_price: productPrice,
      delivery_type: order.shipping.stop_desk ? "stopdesk" : "home",
      products: order.items.map(i => ({ name: i.name, quantity: i.quantity })),
    };
    const res = await fetch(MAYSTRO_API + "/orders/", {
      method: "POST", headers: this.headers, body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Maystro createOrder failed: " + res.status);
    return res.json();
  }
}
