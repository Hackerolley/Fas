// Optional transactional notifications. Leave credentials blank during local development.
// Resend sends email; Meta WhatsApp Cloud API sends approved template messages.
const orderLabel = (order) => `#${order._id.toString().slice(-6).toUpperCase()}`;

export const notifyOrderStatus = async (order) => {
  const user = order.user;
  if (!user) return;

  const reference = orderLabel(order);
  const status = order.status;
  const jobs = [];

  if (user.notificationPreferences?.email && process.env.RESEND_API_KEY && process.env.EMAIL_FROM) {
    jobs.push(fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: [user.email],
        subject: `Order ${reference}: ${status}`,
        html: `<p>Hello ${user.name},</p><p>Your order <strong>${reference}</strong> is now <strong>${status}</strong>.</p>`
      })
    }));
  }

  if (user.notificationPreferences?.whatsapp && user.notificationPreferences.whatsappNumber && process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.WHATSAPP_TEMPLATE_NAME) {
    jobs.push(fetch(`https://graph.facebook.com/v20.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        messaging_product: "whatsapp", to: user.notificationPreferences.whatsappNumber.replace(/\D/g, ""), type: "template",
        template: { name: process.env.WHATSAPP_TEMPLATE_NAME, language: { code: process.env.WHATSAPP_TEMPLATE_LANGUAGE || "en" }, components: [{ type: "body", parameters: [{ type: "text", text: reference }, { type: "text", text: status }] }] }
      })
    }));
  }

  // Notifications must never make an order update fail; provider failures are logged for diagnosis.
  const results = await Promise.allSettled(jobs);
  results.filter((result) => result.status === "rejected").forEach((result) => console.error("Order notification failed:", result.reason));
};
