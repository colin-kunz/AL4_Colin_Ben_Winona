document.addEventListener("DOMContentLoaded", () => {
  // --- Script for Category Navigation Arrows ---
  const kategorienGrid = document.querySelector(".kategorien-grid");
  const prevArrow = document.querySelector(".prev-arrow");
  const nextArrow = document.querySelector(".next-arrow");

  if (kategorienGrid && prevArrow && nextArrow) {
    // Calculate scroll amount based on the first card's width + gap
    const firstCard = kategorienGrid.querySelector(".kategorie-card");
    const scrollAmount = firstCard ? firstCard.offsetWidth + 20 : 270; // 20 is the gap

    prevArrow.addEventListener("click", () => {
      kategorienGrid.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });

    nextArrow.addEventListener("click", () => {
      kategorienGrid.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });
  }

  // --- Script for Midnight Runner Game ---
  const player = document.getElementById("player");
  // Check if player element exists on the page before running game logic
  if (player) {
    const obstacle = document.getElementById("obstacle");
    const scoreDisplay = document.getElementById("score");
    const game = document.getElementById("game");
    const startBtn = document.getElementById("startBtn");
    const reward = document.getElementById("reward");
    const restartBtn = document.getElementById("restartBtn");
    const codeEl = document.getElementById("code");
    const jumpSound = document.getElementById("jumpSound");

    let score = 0;
    let obstacleX = 600;
    let speed = 5;
    let hit = false;
    let rewardShown = false;
    let animationFrame;

    const obstacleImgs = [
      "https://i.postimg.cc/HLGt469n/Chat-GPT-Image-3-Juni-2025-21-41-53.png",
      "https://i.postimg.cc/m2J3Bmqj/Chat-GPT-Image-3-Juni-2025-21-45-02.png",
    ];

    function jump() {
      if (game.classList.contains("hidden")) return; // Don't jump if game hasn't started
      if (!player.classList.contains("jump-animation")) {
        player.classList.add("jump-animation");
        if (jumpSound) jumpSound.play();
        setTimeout(() => player.classList.remove("jump-animation"), 500);
      }
    }

    document.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        e.preventDefault(); // Prevent page from scrolling
        jump();
      }
    });
    // Also listen for clicks/taps on the game area to jump (for mobile)
    if (game) {
      game.addEventListener("click", jump);
    }

    function resetObstacle() {
      obstacleX = 600;
      const randomImg =
        obstacleImgs[Math.floor(Math.random() * obstacleImgs.length)];
      if (obstacle) {
        obstacle.style.backgroundImage = `url('${randomImg}')`;
      }
      hit = false;
    }

    function checkCollision() {
      // Simplified collision check based on original logic
      // This needs to be robust. The original getBoundingClientRect is more reliable.
      // For now, using the provided simplified logic.
      const playerRect = player.getBoundingClientRect();
      const obstacleRect = obstacle.getBoundingClientRect();
      return !(
        playerRect.right < obstacleRect.left ||
        playerRect.left > obstacleRect.right ||
        playerRect.bottom < obstacleRect.top ||
        playerRect.top > obstacleRect.bottom
      );
    }

    function generateCode() {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ01256789"; // Removed 3,4 to avoid confusion
      return (
        "SAVE5-" +
        Array.from(
          { length: 5 },
          () => chars[Math.floor(Math.random() * chars.length)]
        ).join("")
      );
    }

    function updateGame() {
      if (!obstacle || !player) {
        // Stop if elements are missing
        cancelAnimationFrame(animationFrame);
        return;
      }
      obstacleX -= speed;
      obstacle.style.left = obstacleX + "px";

      if (checkCollision() && !hit) {
        hit = true;
        score = 0;
        rewardShown = false;
        if (scoreDisplay) scoreDisplay.innerText = "Punkte: " + score;
      }

      // Use effective width, defaulting to 70 if offsetWidth is not yet available or 0
      const effectiveObstacleWidth =
        obstacle && obstacle.offsetWidth > 0 ? obstacle.offsetWidth : 70;
      if (obstacleX < -effectiveObstacleWidth) {
        // Check against obstacle width
        if (!hit) {
          score++;
          if (scoreDisplay) scoreDisplay.innerText = "Punkte: " + score;

          if (score >= 20 && !rewardShown) {
            // Changed to >= 20 for robustness
            if (codeEl) codeEl.textContent = generateCode();
            if (reward) reward.classList.remove("hidden");
            cancelAnimationFrame(animationFrame);
            rewardShown = true;
            return;
          }

          if (score % 5 === 0 && speed < 15) speed += 0.5;
        }
        resetObstacle();
      }
      animationFrame = requestAnimationFrame(updateGame);
    }

    function startGame() {
      score = 0;
      speed = 5;
      hit = false;
      rewardShown = false;
      if (scoreDisplay) scoreDisplay.innerText = "Punkte: " + score;
      if (reward) reward.classList.add("hidden");

      resetObstacle(); // Resets obstacleX too

      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      animationFrame = requestAnimationFrame(updateGame);
    }

    if (startBtn) {
      startBtn.addEventListener("click", () => {
        startBtn.classList.add("hidden");
        if (game) game.classList.remove("hidden");
        if (scoreDisplay) scoreDisplay.classList.remove("hidden");
        startGame();
      });
    }

    if (restartBtn) {
      restartBtn.addEventListener("click", () => {
        startGame(); // This will re-initialize and start the game loop
      });
    }
  }
});
