document.addEventListener("DOMContentLoaded", () => {
  const pomodoro = document.getElementById("pomodoroModule");
  const toggleBtn = document.getElementById("togglePomodoroBtn");

  let isVisible = false;

  toggleBtn.addEventListener("click", () => {
    pomodoro.style.animation = "none";
    pomodoro.offsetHeight;
    pomodoro.style.animation = "";
    pomodoro.classList.remove("visible", "hidden");

    if (!isVisible) {
      pomodoro.style.display = "block";
      pomodoro.style.opacity = "1";
      pomodoro.style.pointerEvents = "auto";
      pomodoro.classList.add("visible");
      isVisible = true;
    } else {
      pomodoro.classList.add("hidden");
      pomodoro.addEventListener("animationend", () => {
        if (pomodoro.classList.contains("hidden")) {
          pomodoro.classList.remove("hidden");
          pomodoro.style.opacity = "0";
          pomodoro.style.pointerEvents = "none";
          pomodoro.style.transform = "translateX(-150%)";
          pomodoro.style.display = "none";
        }
      }, { once: true });
      isVisible = false;
    }
  });

  const timeDisplay = document.getElementById("time");
  const startBtn = document.getElementById("startBtn");
  const resetBtn = document.getElementById("resetBtn");
  const modeButtons = document.querySelectorAll(".mode");

  const alarmSound = new Audio("https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3");
  alarmSound.preload = "auto";
  alarmSound.loop = true;

  let timer;
  let timeLeft = 20 * 60;
  let isRunning = false;

  let times = {
    pomodoro: 20,
    shortbreak: 5,
    longbreak: 45,
  };

  function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timeDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  function updatePip() {
    if (window.updatePomodoroStatusForPip) {
      window.updatePomodoroStatusForPip(isRunning, timeLeft);
    }
  }

  function startTimer() {
    if (isRunning) {
      clearInterval(timer);
      isRunning = false;
      startBtn.textContent = "Start";
    } else {
      isRunning = true;
      startBtn.textContent = "Stop";
      timer = setInterval(() => {
        if (timeLeft > 0) {
          timeLeft--;
          updateDisplay();
          updatePip();
        } else {
          clearInterval(timer);
          isRunning = false;
          startBtn.textContent = "Start";
          updatePip();
          alarmSound.play();
          showAlarmPopup();
        }
      }, 1000);
    }
    updatePip();
  }

  function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    startBtn.textContent = "Start";
    const active = document.querySelector(".mode.active");
    const mode = active.textContent.toLowerCase().replace(" ", "");
    timeLeft = times[mode] * 60;
    updateDisplay();
    updatePip();
  }

  modeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      modeButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      clearInterval(timer);
      isRunning = false;
      startBtn.textContent = "Start";
      const mode = btn.textContent.toLowerCase().replace(" ", "");
      timeLeft = times[mode] * 60;
      updateDisplay();
      updatePip();
    });
  });

  startBtn.addEventListener("click", startTimer);
  resetBtn.addEventListener("click", resetTimer);

  updateDisplay();
  updatePip();

  // Kéo thả module mượt
  function makeDraggable(target, handle) {
    let isDragging = false;
    let pos = { x: 0, y: 0 };
    let offset = { x: 0, y: 0 };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      pos.x = e.clientX - offset.x;
      pos.y = e.clientY - offset.y;
      target.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
    };

    const onPointerUp = () => {
      isDragging = false;
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
      target.style.left = `${pos.x}px`;
      target.style.top = `${pos.y}px`;
      target.style.transform = "";
    };

    handle.addEventListener("pointerdown", (e) => {
      const rect = target.getBoundingClientRect();
      offset.x = e.clientX - rect.left;
      offset.y = e.clientY - rect.top;
      pos.x = rect.left;
      pos.y = rect.top;

      target.style.position = "fixed";
      target.style.left = `${pos.x}px`;
      target.style.top = `${pos.y}px`;

      isDragging = true;
      document.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerup", onPointerUp);
    });
  }

  makeDraggable(pomodoro, document.getElementById("dragHandle"));

  // Thu nhỏ
  document.getElementById("minimizeBtn").addEventListener("click", () => {
    pomodoro.classList.toggle("minimized");
  });

  // Cài đặt
  const settingsBtn = document.querySelector(".settings");
  const settingsPanel = document.getElementById("settingsPanel");
  const saveBtn = document.getElementById("saveSettings");

  const inputPomodoro = document.getElementById("setPomodoro");
  const inputShort = document.getElementById("setShortBreak");
  const inputLong = document.getElementById("setLongBreak");

  settingsBtn.addEventListener("click", () => {
    settingsPanel.style.display = settingsPanel.style.display === "none" ? "block" : "none";
  });

  saveBtn.addEventListener("click", () => {
    times.pomodoro = parseInt(inputPomodoro.value) || 25;
    times.shortbreak = parseInt(inputShort.value) || 5;
    times.longbreak = parseInt(inputLong.value) || 15;

    const active = document.querySelector(".mode.active");
    const mode = active.textContent.toLowerCase().replace(" ", "");
    timeLeft = times[mode] * 60;
    updateDisplay();
    updatePip();

    alert("✅ Đã cập nhật thời gian!");
    settingsPanel.style.display = "none";
  });

  function showAlarmPopup() {
    const popup = document.createElement("div");
    popup.innerHTML = `
      <div id="alarmOverlay" style="
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex; justify-content: center; align-items: center;
        z-index: 9999;">
        <div style="
          background: white; padding: 20px 30px; border-radius: 10px;
          text-align: center; max-width: 300px; font-family: Arial, sans-serif;
          color: black;">
          <h3 style="margin-bottom: 10px;">⏰ Hết giờ!</h3>
          <p style="margin-bottom: 15px;">Bạn đã hoàn thành thời gian, hãy nghỉ ngơi hoặc chọn chế độ khác.</p>
          <button id="stopAlarmBtn" style="
            padding: 8px 16px; background: #4CAF50; color: white;
            border: none; border-radius: 6px; cursor: pointer;">OK</button>
        </div>
      </div>`;
    document.body.appendChild(popup);

    document.getElementById("stopAlarmBtn").addEventListener("click", () => {
      alarmSound.pause();
      alarmSound.currentTime = 0;
      document.getElementById("alarmOverlay").remove();
    });
  }
});


const nightModeBtn = document.getElementById("night-mode");

nightModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const pomodoroBox = document.querySelector(".pomodoro");
  pomodoroBox.classList.toggle("dark-theme");
});
