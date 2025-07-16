// donate.js
document.getElementById("donateBtn").onclick = function() {
  document.getElementById("donateModal").style.display = "flex";
};
function closeDonateModal() {
  document.getElementById("donateModal").style.display = "none";
}
function copyBankNumber() {
  const number = document.getElementById("bankNumber").innerText;
  navigator.clipboard.writeText(number);
  alert("Đã copy số tài khoản!");
}