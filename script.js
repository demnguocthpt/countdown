document.addEventListener("DOMContentLoaded", () => {
  // Hiệu ứng tiêu đề động
  const text = "Countdown to Graduation";
  const chars = text.split('');
  let visible = [...chars];
  let index = chars.length - 1;
  let deleting = true;

  function animateTitle() {
    if (deleting) {
      if (index >= 1) {
        if (chars[index] !== ' ') visible[index] = '';
        index--;
      } else {
        deleting = false;
        index = 1;
      }
    } else {
      if (index < chars.length) {
        if (chars[index] !== ' ') visible[index] = chars[index];
        index++;
      } else {
        deleting = true;
        index = chars.length - 1;
      }
    }
    document.title = visible.join('');
    setTimeout(animateTitle, 150);
  }
  animateTitle();

  // Audio Player Controls
  const audioPlayer = document.getElementById('audioPlayer');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const playPauseIcon = document.getElementById('playPauseIcon');
  const trackTitle = document.getElementById('trackTitle');
  const currentTimeEl = document.getElementById('currentTime');
  const durationEl = document.getElementById('duration');
  const progressBar = document.getElementById('progressBar');

  const mainVolumeSlider = document.getElementById('mainVolume'); // Volume trong hộp nhạc

  let isPlaying = false;
  const playIcon = "https://cdn-icons-png.flaticon.com/512/27/27223.png";
  const pauseIcon = "https://cdn-icons-png.flaticon.com/512/3669/3669483.png";

  // Phát tự động sau lần click đầu tiên
  window.addEventListener('click', () => {
    if (!isPlaying) {
      audioPlayer.play().then(() => {
        console.log('Đã phát nhạc sau tương tác đầu tiên');
      }).catch(err => console.log('Không thể phát nhạc:', err));
      isPlaying = true;
    }
  }, { once: true });

  function formatTime(time) {
    const minutes = Math.floor(time / 60) || 0;
    const seconds = Math.floor(time % 60) || 0;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  audioPlayer.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(audioPlayer.duration);
  });

  audioPlayer.addEventListener('timeupdate', () => {
    currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
    const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.width = `${percent}%`;
  });

  playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
      audioPlayer.pause();
      playPauseIcon.src = playIcon;
    } else {
      audioPlayer.play();
      playPauseIcon.src = pauseIcon;
    }
    isPlaying = !isPlaying;
  });

  trackTitle.addEventListener('click', () => {
    audioPlayer.play();
    playPauseIcon.src = pauseIcon;
    isPlaying = true;
  });

  // Overlay
  const overlay = document.getElementById('overlay');
  overlay.addEventListener('click', () => {
    overlay.style.opacity = 0;
    setTimeout(() => {
      overlay.style.display = 'none';
      audioPlayer.play().catch(err => console.log("Autoplay bị chặn:", err));
    }, 500);
  });

  // Volume Control (dành riêng cho hộp music)
  if (mainVolumeSlider) {
    mainVolumeSlider.addEventListener("input", () => {
      audioPlayer.volume = parseFloat(mainVolumeSlider.value);
    });

    // Gán giá trị mặc định ban đầu
    audioPlayer.volume = parseFloat(mainVolumeSlider.value);
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const settingsBtn = document.getElementById("settingsToggleBtn");
  const settingsMenu = document.getElementById("settingsMenu");

  settingsBtn.addEventListener("click", () => {
    settingsMenu.classList.toggle("active");
  });
});


document.getElementById("night-mode").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});



