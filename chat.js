document.addEventListener("DOMContentLoaded", () => {
  const chatBtn = document.getElementById("chatBtn");
  const chatBox = document.getElementById("chat-box");
  let isChatVisible = false;

  chatBtn.addEventListener("click", () => {
    chatBox.classList.remove("slide-in", "slide-out");

    if (!isChatVisible) {
      chatBox.style.display = "block";
      requestAnimationFrame(() => {
        chatBox.classList.add("slide-in");
      });
      isChatVisible = true;
    } else {
      chatBox.classList.add("slide-out");
      chatBox.addEventListener("animationend", () => {
        chatBox.style.display = "none";
        chatBox.classList.remove("slide-out");
        isChatVisible = false;
      }, { once: true });
    }
  });

  window.sendToDiscord = function () {
    const sender = document.getElementById("sender").value.trim();
    const message = document.getElementById("message").value.trim();
    const signature = document.getElementById("signature").value.trim();

    if (!sender || !message) {
      alert("❗ Vui lòng nhập tên và nội dung.");
      return;
    }

    const webhookURL = "https://discord.com/api/webhooks/1391749380884664361/7_8_pR_pxoQaqCe-blfAoSkvqYE3JmLuRn6zNuya-iXdRJAf0vacc_Vt0w1XyTeAxF7k";
    const payload = {
      content: `📨 **Tin nhắn mới từ người dùng**\n👤 **Người gửi:** ${sender}\n💬 **Nội dung:** ${message}\n✍️ **Ký tên:** ${signature || "(Không có)"}`,
    };

    fetch(webhookURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    .then((res) => {
      if (res.ok) {
        alert("✅ Đã gửi thành công!");
        document.getElementById("sender").value = "";
        document.getElementById("message").value = "";
        document.getElementById("signature").value = "";
        chatBox.classList.add("slide-out");
        chatBox.addEventListener("animationend", () => {
          chatBox.style.display = "none";
          chatBox.classList.remove("slide-out");
          isChatVisible = false;
        }, { once: true });
      } else {
        alert("❌ Gửi thất bại. Vui lòng thử lại.");
      }
    })
    .catch((err) => {
      console.error(err);
      alert("⚠️ Lỗi khi gửi tin nhắn.");
    });
  };
});
