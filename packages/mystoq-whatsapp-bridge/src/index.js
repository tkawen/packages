// Mystoq <-> WhatsApp Cloud API bridge
// https://mystoq.com

const META_API = "https://graph.facebook.com/v19.0";

export class WhatsAppBridge {
  constructor({ phoneNumberId, accessToken }) {
    this.phoneId = phoneNumberId;
    this.token = accessToken;
  }

  async sendText(to, body) {
    return this.#req({ messaging_product: "whatsapp", to, type: "text", text: { body } });
  }

  async sendOrderConfirmation(to, order) {
    const total = (order.total / 100).toLocaleString("en-DZ");
    const msg =
      `🟢 طلبك مؤكّد!\n\n` +
      `رقم الطلب: ${order.id}\n` +
      `الإجمالي: ${total} دج\n` +
      `الولاية: ${order.shipping.wilaya}\n\n` +
      `سنتواصل معك عند الشحن.\nمتجرك: ${order.store_url || "https://mystoq.com"}`;
    return this.sendText(to, msg);
  }

  async sendCartReminder(to, cartUrl) {
    return this.sendText(to,
      `👋 تركت بعض المنتجات في سلّتك على متجرنا.\n\nأكمل الطلب: ${cartUrl}`);
  }

  async #req(body) {
    const r = await fetch(`${META_API}/${this.phoneId}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!r.ok) throw new Error("WhatsApp API " + r.status);
    return r.json();
  }
}
