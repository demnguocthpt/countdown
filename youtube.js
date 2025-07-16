document.addEventListener("DOMContentLoaded", () => {
  const musicBox = document.getElementById("musicBox");
  const toggleMusic = document.getElementById("toggleMusic");
  const closeMusic = document.getElementById("closeMusic");
  const youtubeInput = document.getElementById("youtubeUrl");
  const youtubeIframe = document.getElementById("ytPlayer");
  const youtubeVolume = document.getElementById("youtubeVolume");
  const loadBtn = document.getElementById("loadYoutube");
  const ambianceVolumes = document.querySelectorAll(".ambianceVolume");
  const muteBtns = document.querySelectorAll(".muteBtn");

  let isOpen = false;

  toggleMusic.addEventListener("click", () => {
    isOpen = !isOpen;
    musicBox.classList.toggle("active", isOpen);
  });

  closeMusic.addEventListener("click", () => {
    isOpen = false;
    musicBox.classList.remove("active");
  });

  loadBtn.addEventListener("click", () => {
  const url = youtubeInput.value.trim();
  const videoId = getYoutubeId(url);
  if (videoId) {
    youtubeIframe.src =
      `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=0&loop=1&playlist=${videoId}&enablejsapi=1`;
    youtubeIframe.style.display = "block";
  } else {
    alert("❗ Vui lòng nhập link YouTube hợp lệ");
  }
});
// Hàm trích xuất ID video từ link
function getYoutubeId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]{11}).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}
  youtubeVolume.addEventListener("input", () => {
    const iframe = youtubeIframe.contentWindow;
    iframe.postMessage(JSON.stringify({
      event: "command",
      func: "setVolume",
      args: [parseInt(youtubeVolume.value * 100)]
    }), "*");
  });

  ambianceVolumes.forEach(slider => {
    const id = slider.dataset.sound;
    const audio = document.getElementById(id);
    slider.addEventListener("input", () => {
      audio.volume = parseFloat(slider.value);
      if (audio.paused && audio.volume > 0) audio.play();
      if (audio.volume === 0) audio.pause();
    });
  });
  muteBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.sound;
      const audio = document.getElementById(id);
      audio.volume = 0;
      audio.pause();
      document.querySelector(`.ambianceVolume[data-sound="${id}"]`).value = 0;
    });
  });
});

document.getElementById("night-mode").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  const pomodoroBox = document.querySelector(".pomodoro");
  if (pomodoroBox) pomodoroBox.classList.toggle("dark-theme");
});

