const playPauseButton = document.getElementById('play-pause-button');
const backgroundMusic = document.getElementById('background-music');

let isPlaying = false;

playPauseButton.addEventListener('click', () => {
  if (isPlaying) {
    backgroundMusic.pause();
    playPauseButton.innerHTML = '<i class="fas fa-play"></i>'; // Ganti ikon ke play
  } else {
    backgroundMusic.play();
    playPauseButton.innerHTML = '<i class="fas fa-pause"></i>'; // Ganti ikon ke pause
    createSnowflakes(); // Panggil fungsi untuk membuat salju
  }
  isPlaying = !isPlaying; // Toggle status
});

function createSnowflakes() {
  const snowContainer = document.createElement('div');
  snowContainer.classList.add('snow');
  document.body.appendChild(snowContainer);

  for (let i = 0; i < 50; i++) {
    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');
    const size = Math.random() * 10 + 5; // Ukuran acak antara 5px dan 15px
    snowflake.style.width = `${size}px`;
    snowflake.style.height = `${size}px`;
    snowflake.style.left = `${Math.random() * 100}vw`; // Posisi horizontal acak
    snowflake.style.animationDuration = `${Math.random() * 3 + 2}s`; // Durasi acak antara 2s dan 5s
    snowflake.style.animationDelay = `${Math.random() * 5}s`;
    snowContainer.appendChild(snowflake);
  }

  // Tambahkan kode untuk menghapus snow setelah beberapa detik
  setTimeout(() => {
    snowContainer.remove();
  }, 10000); // Hapus snow setelah 10 detik
}

// Tema Gelap dan Terang
const themeToggle = document.getElementById('theme-toggle');
let isDarkTheme = true;

themeToggle.addEventListener('click', () => {
  if (isDarkTheme) {
    document.body.classList.add('dark-theme'); // Tambahkan kelas untuk tema gelap
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>'; // Ganti ikon ke matahari
  } else {
    document.body.classList.remove('dark-theme'); // Hapus kelas untuk tema gelap
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>'; // Ganti ikon ke bulan
  }
  isDarkTheme = !isDarkTheme; // Toggle status
});
