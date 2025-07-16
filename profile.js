document.addEventListener("DOMContentLoaded", () => {
  // Toggle profile panel
  const toggleProfile = document.getElementById("toggleProfile");
  const profilePanel = document.getElementById("profilePanel");
  toggleProfile?.addEventListener("click", () => {
    profilePanel?.classList.toggle("active");
  });

  // Avatar change
  const avatarImg = document.getElementById("avatarImage");
  const avatarInput = document.getElementById("avatarInput");
  const changeAvatarBtn = document.getElementById("changeAvatarBtn");

  // Profile editing
  const nameEl = document.getElementById("profileName");
  const descEl = document.getElementById("profileDesc");
  const editBtn = document.getElementById("editProfileBtn");
  const saveBtn = document.getElementById("saveProfileBtn");

  const socialFields = {
    insta: document.getElementById("socialInsta"),
    discord: document.getElementById("socialDiscord"),
    twitter: document.getElementById("socialTwitter"),
    spotify: document.getElementById("socialSpotify"),
  };

  // Lấy user hiện tại
  const currentUser = localStorage.getItem("currentUser");

  // Sự kiện đổi avatar
  if (changeAvatarBtn) {
    changeAvatarBtn.addEventListener("click", () => {
      if (!avatarInput.disabled) avatarInput?.click();
    });
  }
  if (avatarInput) {
    avatarInput.addEventListener("change", function () {
      if (avatarInput.disabled || !currentUser) return;
      const file = this.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function (e) {
        const dataURL = e.target.result;
        avatarImg.src = dataURL;
        localStorage.setItem(`avatar_${currentUser}`, dataURL);
      };
      reader.readAsDataURL(file);
    });
  }

  function loadProfile() {
    const isLoggedIn = !!currentUser;
    if (!isLoggedIn) {
      // Mặc định khi chưa đăng nhập
      avatarImg.src = "3.jpg";
      nameEl.innerText = "𝑮𝒊𝒗𝒆 𝒎𝒆 𝒚𝒐𝒖𝒓 𝒔𝒐𝒖𝒍";
      descEl.innerText = "học ngày cày đêm";
      if (socialFields.insta) socialFields.insta.value = "";
      if (socialFields.discord) socialFields.discord.value = "";
      if (socialFields.twitter) socialFields.twitter.value = "";
      if (socialFields.spotify) socialFields.spotify.value = "";
      return;
    }
    // Đã đăng nhập: load profile riêng cho user
    const profile = JSON.parse(localStorage.getItem(`profile_${currentUser}`)) || {};
    if (profile.name) nameEl.innerText = profile.name;
    if (profile.desc) descEl.innerText = profile.desc;
    if (profile.social) {
      if (socialFields.insta) socialFields.insta.value = profile.social.insta || "";
      if (socialFields.discord) socialFields.discord.value = profile.social.discord || "";
      if (socialFields.twitter) socialFields.twitter.value = profile.social.twitter || "";
      if (socialFields.spotify) socialFields.spotify.value = profile.social.spotify || "";
    }
    // Avatar riêng cho user
    const savedAvatar = localStorage.getItem(`avatar_${currentUser}`);
    avatarImg.src = savedAvatar ? savedAvatar : "3.jpg";
  }

  function enableEditing(enable) {
    nameEl.contentEditable = enable;
    descEl.contentEditable = enable;
    Object.values(socialFields).forEach(input => {
      if (input) input.readOnly = !enable;
    });
    if (editBtn) editBtn.style.display = enable ? "none" : "inline-block";
    if (saveBtn) saveBtn.style.display = enable ? "inline-block" : "none";
  }

  // Sự kiện edit/save
  if (editBtn) {
    editBtn.addEventListener("click", () => enableEditing(true));
  }
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      if (!currentUser) return;
      const profile = {
        name: nameEl.innerText.trim(),
        desc: descEl.innerText.trim(),
        social: {
          insta: socialFields.insta ? socialFields.insta.value.trim() : "",
          discord: socialFields.discord ? socialFields.discord.value.trim() : "",
          twitter: socialFields.twitter ? socialFields.twitter.value.trim() : "",
          spotify: socialFields.spotify ? socialFields.spotify.value.trim() : ""
        }
      };
      localStorage.setItem(`profile_${currentUser}`, JSON.stringify(profile));
      enableEditing(false);
      alert("✅ Đã lưu thông tin cá nhân!");
    });
  }

  // Ẩn/hiện và disable các chức năng theo trạng thái đăng nhập
  function updateProfileUI() {
    const isLoggedIn = !!currentUser;
    if (!isLoggedIn) {
      if (editBtn) editBtn.style.display = "none";
      if (saveBtn) saveBtn.style.display = "none";
      if (changeAvatarBtn) changeAvatarBtn.style.display = "none";
      if (avatarInput) avatarInput.disabled = true;
      if (avatarImg) avatarImg.style.pointerEvents = "none";
      nameEl.contentEditable = false;
      descEl.contentEditable = false;
      Object.values(socialFields).forEach(input => {
        if (input) input.readOnly = true;
      });
    } else {
      if (editBtn) editBtn.style.display = "inline-block";
      if (changeAvatarBtn) changeAvatarBtn.style.display = "inline-block";
      if (saveBtn) saveBtn.style.display = "none";
      if (avatarInput) avatarInput.disabled = false;
      if (avatarImg) avatarImg.style.pointerEvents = "auto";
    }
  }

  updateProfileUI();
  loadProfile();
});