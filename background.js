  // Nút mở toàn màn hình
  document.getElementById("fullscreenBtn").addEventListener("click", () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  });

  // Danh sách video nền
  const bgVideos = ["1.mp4", "2.mp4", "3.mp4", "4.mp4", "5.mp4", "6.mp4", "7.mp4", "8.mp4", "9.mp4", "10.mp4"]; // thêm tên video của bạn vào đây
  let currentVideo = 0;

  document.getElementById("changeBgBtn").addEventListener("click", () => {
    currentVideo = (currentVideo + 1) % bgVideos.length;
    const bgVideo = document.getElementById("bg-video");
    bgVideo.src = bgVideos[currentVideo];
    bgVideo.load();
    bgVideo.play();
  });
