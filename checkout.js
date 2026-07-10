const cart = JSON.parse(localStorage.getItem("cart")) || [];

// =====================
// ORDER PREVIEW (страница оформления)
// =====================
const orderBox = document.getElementById("order-items");
const totalBox = document.getElementById("order-total");

if (orderBox && totalBox) {

  let total = 0;

  cart.forEach(item => {

    total += item.price;

    const div = document.createElement("div");
    div.classList.add("order-item");

    div.innerHTML = `
      <span>${item.name}</span>
      <span>${item.price} грн</span>
    `;

    orderBox.appendChild(div);
  });

  totalBox.textContent = total;
}

// =====================
// CHECKOUT FORM + TELEGRAM
// =====================
const form = document.getElementById("checkout-form");

if (form) {

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const comment = document.getElementById("comment").value;

    let total = 0;
    let text = `🛒 НОВЕ ЗАМОВЛЕННЯ\n\n`;

    text += `👤 Ім'я: ${firstName} ${lastName}\n`;
    text += `📞 Телефон: ${phone}\n`;
    text += `📧 Email: ${email}\n`;
    text += `💬 Коментар: ${comment || "-"}\n\n`;

    text += `📚 КУРСИ:\n`;

    cart.forEach(item => {
      text += `• ${item.name} — ${item.price} грн\n`;
      total += item.price;
    });

    text += `\n💰 СУМА: ${total} грн`;

    const BOT_TOKEN = "8753837379:AAHcCFmHdbLTnv86OXDLiszfaGhVUr1Hj4A"; 
    const CHAT_ID = "6167594260";

    try {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: text
        })
      });

      localStorage.removeItem("cart");

      alert("✅ Замовлення відправлено!");
      window.location.href = "index.html";

    } catch (err) {
      console.error(err);
      alert("❌ Помилка відправки");
    }
  });
}