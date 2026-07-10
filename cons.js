document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".consultation-form");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nameInput = form.querySelector('input[type="text"]');
    const emailInput = form.querySelector('input[type="email"]');
    const phoneInput = form.querySelector('input[type="tel"]');
    const checkbox = form.querySelector('input[type="checkbox"]');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();

    if (!checkbox.checked) {
      alert("Потрібно погодитись з умовами");
      return;
    }

    if (!name || !phone) {
      alert("Заповніть обов'язкові поля");
      return;
    }

    const BOT_TOKEN = "8753837379:AAHcCFmHdbLTnv86OXDLiszfaGhVUr1Hj4A";
    const CHAT_ID = "6167594260";

    const text =
`🚀 НОВА КОНСУЛЬТАЦІЯ

👤 Ім'я: ${name}
📧 Email: ${email || "-"}
📞 Телефон: ${phone}
`;

    try {
      const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: text
        })
      });

      if (!res.ok) throw new Error("Telegram error");

      alert("Дякуємо! Ми скоро зв’яжемося 🚀");
      form.reset();

    } catch (err) {
      console.error(err);
      alert("Помилка відправки. Спробуйте ще раз.");
    }
  });
});