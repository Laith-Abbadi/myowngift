// Phase 1: Welcome Page
document.getElementById('continue-btn').addEventListener('click', () => {
  document.getElementById('welcome-page').classList.add('hidden');
  document.getElementById('game-page').classList.remove('hidden');
  startGame();
});

// Phase 2: Heart Collection Game
let heartsCollected = 0;

function startGame() {
  const gameArea = document.getElementById('game-area');
  const player = document.getElementById('player');
  const heartCounter = document.getElementById('count');

  // Move player
  document.addEventListener('mousemove', (e) => {
    player.style.left = `${e.clientX - 25}px`;
  });

  // Create hearts
  setInterval(() => {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.style.left = `${Math.random() * window.innerWidth}px`;
    gameArea.appendChild(heart);

    // Check collision
    const checkCollision = setInterval(() => {
      const heartRect = heart.getBoundingClientRect();
      const playerRect = player.getBoundingClientRect();

      if (
        heartRect.bottom >= playerRect.top &&
        heartRect.top <= playerRect.bottom &&
        heartRect.right >= playerRect.left &&
        heartRect.left <= playerRect.right
      ) {
        heartsCollected++;
        heartCounter.textContent = heartsCollected;
        heart.remove();
        if (heartsCollected >= 100) {
          document.getElementById('game-page').classList.add('hidden');
          document.getElementById('message-page').classList.remove('hidden');
          showMessages();
        }
      }
    }, 10);
  }, 500);
}

// Phase 3: Message Reveal
function showMessages() {
  const messages = document.querySelectorAll('.message');
  messages.forEach((msg, index) => {
    setTimeout(() => {
      msg.style.opacity = 1;
      msg.style.transform = 'translateY(0)';
    }, index * 2000);
  });

  setTimeout(() => {
    document.getElementById('claim-btn').classList.remove('hidden');
  }, messages.length * 2000);
}

// Phase 4: Claim Button
document.getElementById('claim-btn').addEventListener('click', () => {
  document.getElementById('popup').classList.remove('hidden');
});
