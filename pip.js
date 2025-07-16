const canvas = document.getElementById("pipCanvas");
const ctx = canvas.getContext("2d");
const pipVideo = document.getElementById("pipVideo");
const bgVideo = document.getElementById("bg-video");

let isPomodoroRunning = false;
let timeLeft = 0;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Vẽ video nền nếu có đủ dữ liệu
  if (bgVideo.readyState >= 2) {
    try {
      ctx.drawImage(bgVideo, 0, 0, canvas.width, canvas.height);
    } catch (e) {
      ctx.fillStyle = "#444";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  } else {
    ctx.fillStyle = "#444";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  // Lấy CSS biến từ pip.css
  const style = getComputedStyle(document.documentElement);
  const fontSize = style.getPropertyValue("--pip-font-size").trim() || "30px";
  const fontFamily = style.getPropertyValue("--pip-font-family").trim() || "Arial";
  const textColor = style.getPropertyValue("--pip-text-color").trim() || "white";
  const lineHeight = parseInt(style.getPropertyValue("--pip-line-height")) || 36;
  const overlayColor = style.getPropertyValue("--pip-bg-overlay").trim() || "rgba(0,0,0,0.4)";
  const shadow = style.getPropertyValue("--pip-shadow").trim() || "1px 1px 4px rgba(0,0,0,0.7)";
  // Vẽ overlay mờ
  ctx.fillStyle = overlayColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // Cài đặt chữ
  ctx.font = `${fontSize} ${fontFamily}`;
  ctx.fillStyle = textColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const shadowParts = shadow.split(" ");
  ctx.shadowColor = shadowParts[3] || "black";
  ctx.shadowBlur = parseInt(shadowParts[2]) || 4;
  ctx.shadowOffsetX = parseInt(shadowParts[0]) || 1;
  ctx.shadowOffsetY = parseInt(shadowParts[1]) || 1;
  // Tạo nội dung hiển thị
  let lines = [];
  if (isPomodoroRunning && timeLeft > 0) {
    const m = Math.floor(timeLeft / 60).toString().padStart(2, "0");
    const s = (timeLeft % 60).toString().padStart(2, "0");
    lines.push(`${m}:${s}`);
  } else {
const now = new Date();
const hour = now.getHours().toString().padStart(2, "0");
const min = now.getMinutes().toString().padStart(2, "0");
const sec = now.getSeconds().toString().padStart(2,"0")
const day = now.getDate().toString().padStart(2, "0");
const month = (now.getMonth() + 1).toString().padStart(2, "0");
const year = now.getFullYear();
// Lấy thứ bằng số (0 = Chủ Nhật, 1 = Thứ 2,...)
const weekdayIndex = now.getDay();
const weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const weekday = weekdays[weekdayIndex];
// Dạng custom 1: T2 - 15/07/2025
const customDate = `${weekday} - ${day}. ${month}. ${year}`;
    lines.push(`${hour}:${min}:${sec}`);
    lines.push(`${customDate}`);
  }
  // Vẽ từng dòng
 // Căn giữa theo chiều dọc
const totalHeight = lines.length * lineHeight;
const startY = (canvas.height - totalHeight) / 2 + lineHeight / 2;

lines.forEach((line, i) => {
  ctx.fillText(line, canvas.width / 2, startY + i * lineHeight);
});
  requestAnimationFrame(draw);
}
draw();
// Ghi canvas ra video
const stream = canvas.captureStream(30);
pipVideo.srcObject = stream;
pipVideo.play();
// Nhận trạng thái từ promodo.js
window.updatePomodoroStatusForPip = function (status, secondsLeft) {
  isPomodoroRunning = status;
  timeLeft = secondsLeft;
};
// Giảm thời gian Pomodoro
setInterval(() => {
  if (isPomodoroRunning && timeLeft > 0) {
    timeLeft--;
  }
}, 1000);
// Tự bật/tắt PiP khi chuyển tab
document.addEventListener("visibilitychange", async () => {
  if (document.hidden) {
    try {
      await pipVideo.requestPictureInPicture();
    } catch (err) {
      console.warn("⚠️ Không thể bật Picture-in-Picture:", err);
    }
  } else if (document.pictureInPictureElement) {
    await document.exitPictureInPicture();
  }
});
