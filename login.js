document.addEventListener("DOMContentLoaded", function () {
  // ✅ Khởi tạo EmailJS
  emailjs.init("T4hhw4qecN_5Z5g-q"); // <-- thay bằng PUBLIC KEY của bạn

  const showLoginBtn = document.getElementById("showLogin");
  const showRegisterBtn = document.getElementById("showRegister");
  const authBox = document.getElementById("authBox");

  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  const loginUsername = document.getElementById("loginUsername");
  const loginPassword = document.getElementById("loginPassword");
  const regUsername = document.getElementById("regUsername");
  const regPassword = document.getElementById("regPassword");
  const regConfirm = document.getElementById("regConfirm");
  const recovery = document.getElementById("recovery");

  // 👉 Mở hộp đăng nhập/đăng ký
  showLoginBtn.onclick = () => {
    authBox.style.display = "block";
    switchForm("login");
  };
  showRegisterBtn.onclick = () => {
    authBox.style.display = "block";
    switchForm("register");
  };

  function switchForm(mode) {
    loginForm.style.display = mode === "login" ? "block" : "none";
    registerForm.style.display = mode === "register" ? "block" : "none";
  }

  function closeAuth() {
    authBox.style.display = "none";
  }

  // ✅ Cập nhật giao diện nút đăng nhập/đăng ký/đăng xuất
  function updateAuthButtons() {
    const isLoggedIn = !!localStorage.getItem("currentUser");
    document.getElementById("showLogin").style.display = isLoggedIn ? "none" : "inline-block";
    document.getElementById("showRegister").style.display = isLoggedIn ? "none" : "inline-block";
    document.getElementById("logoutBtn").style.display = isLoggedIn ? "inline-block" : "none";
  }

  // ✅ Đăng ký
  window.register = function () {
    const u = regUsername.value.trim();
    const p = regPassword.value;
    const c = regConfirm.value;
    const r = recovery.value.trim();

    // Kiểm tra email hợp lệ
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!u || !p || !c || !r) return alert("⚠️ Điền đầy đủ thông tin.");
    if (!emailRegex.test(r)) return alert("❗ Email không hợp lệ.");
    if (p !== c) return alert("❗ Mật khẩu không khớp.");
    if (localStorage.getItem(`user_${u}`)) return alert("❌ Tài khoản đã tồn tại.");

    const user = { password: p, recovery: r };
    localStorage.setItem(`user_${u}`, JSON.stringify(user));
    alert("✅ Đăng ký thành công!");
    switchForm("login");
  };

  // ✅ Đăng nhập
  window.login = function () {
    const u = loginUsername.value.trim();
    const p = loginPassword.value;
    const data = localStorage.getItem(`user_${u}`);

    if (!data) return alert("❌ Tài khoản không tồn tại.");
    const { password } = JSON.parse(data);
    if (p !== password) return alert("❌ Sai mật khẩu.");

    alert(`✅ Chào mừng ${u}!`);
    localStorage.setItem("currentUser", u);

    // Nếu chưa có profile thì tạo profile/avatar mặc định cho user này
    if (!localStorage.getItem(`profile_${u}`)) {
      localStorage.setItem(`profile_${u}`, JSON.stringify({
        name: "USER 1",
        desc: "",
        social: {}
      }));
      localStorage.setItem(`avatar_${u}`, "3.jpg"); // Avatar mặc định cho user này
    }

    closeAuth();
    updateAuthButtons();
    location.reload();
  };

  // ✅ Đăng xuất
  window.logout = function () {
    localStorage.removeItem("currentUser");
    updateAuthButtons();
    alert("🚪 Đã đăng xuất!");
    location.reload();
  };

  // ✅ Quên mật khẩu (Gửi Email)
  window.forgot = function () {
    const u = prompt("🔍 Nhập tên tài khoản bạn quên:");
    const data = localStorage.getItem(`user_${u}`);
    if (!data) return alert("❌ Không tìm thấy tài khoản.");
    const { password, recovery } = JSON.parse(data);

    emailjs.send("service_9053cdv", "template_zrscmkl", {
      to_email: recovery,
      message: `🔐 Mật khẩu của bạn là: ${password}`
    })
    .then(() => alert("📧 Đã gửi mật khẩu về email khôi phục."))
    .catch((err) => {
      console.error("Lỗi gửi email:", err);
      alert("⚠️ Gửi email thất bại.");
    });
  };

  // Nút đóng auth box
  window.closeAuthBox = function () {
    authBox.style.display = "none";
  };

  // Gọi khi load trang
  updateAuthButtons();
});