function updateClock() {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const vnTime = new Date(utc + 7 * 3600000);
      document.getElementById('clock').textContent = vnTime.toLocaleTimeString('vi-VN', { hour12: false });
    }
    function updateDate() {
      const now = new Date();
      const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
      const day = days[now.getDay()];
      const dateStr = `${day} - ${String(now.getDate()).padStart(2, '0')}. ${String(now.getMonth() + 1).padStart(2, '0')}. ${now.getFullYear()}`;
      document.getElementById('date').textContent = dateStr;
    }
    setInterval(() => {
      updateClock();
      updateDate();
    }, 1000);
    updateClock();
    updateDate();

// Hàm cập nhật ngày hiện tại
function updateDate() {
  const now = new Date();
  const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const dayName = days[now.getDay()];
  const dateString = `${dayName} - ${String(now.getDate()).padStart(2, '0')}. ${String(now.getMonth() + 1).padStart(2, '0')}. ${now.getFullYear()}`;

  const dateEl = document.getElementById("date");
  if (dateEl) {
    dateEl.textContent = dateString;
  }
}

// Hàm khởi động đồng hồ và ngày tháng
function startClock() {
  updateClock();
  updateDate();
  setInterval(() => {
    updateClock();
    updateDate();
  }, 1000);
}

// Tự động chạy khi DOM sẵn sàng
document.addEventListener("DOMContentLoaded", startClock);
